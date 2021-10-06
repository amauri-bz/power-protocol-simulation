/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <opendnp3/DNP3Manager.h>
#include <opendnp3/channel/PrintingChannelListener.h>
#include <opendnp3/logging/LogLevels.h>
#include <opendnp3/outstation/DefaultOutstationApplication.h>
#include <opendnp3/outstation/IUpdateHandler.h>
#include <opendnp3/outstation/UpdateBuilder.h>

#include "fileLogger.h"
#include "db.h"
#include "commandHandler.h"

#include <iostream>
#include <string>
#include <thread>

#include <iterator>
#include <regex>

#include <fstream>

using namespace std;
using namespace opendnp3;

void PrintMap(const std::map<std::string, std::string> &m)
{
    for (const auto &elem : m)
    {
        std::cout << elem.first << ":" << elem.second << "\n";
    }
}

void ConfigParser()
{
    std::ifstream file(mydb::obj().PATH + "\\rtu_dnp3_config_" + mydb::obj().ID + ".txt");
    if (file.is_open())
    {
        std::string line;
        while (std::getline(file, line))
        {
            const regex r("^([A-Z_0-9]+)=(.*)");
            smatch sm;
            if (regex_search(line, sm, r))
            {
                if (sm.size() > 2)
                {
                    mydb::obj().DB_CONFIG[sm[1]] = sm[2];
                }
            }
        }
        file.close();
    }
    PrintMap(mydb::obj().DB_CONFIG);
}

DatabaseConfig ConfigureDatabase()
{
    DatabaseConfig config = {};

    for (int i = 1; i <= 5; i++)
    {
        int point = std::stoi(mydb::obj().DB_CONFIG["POINT" + std::to_string(i)]);
        std::string tid = mydb::obj().DB_CONFIG["TID" + std::to_string(i)];

        if (tid == "Analog")
        {
            config.analog_input[point].clazz = PointClass::Class2;
            config.analog_input[point].svariation = StaticAnalogVariation::Group30Var5;
            config.analog_input[point].evariation = EventAnalogVariation::Group32Var7;
            mydb::obj().state.value[point] = 0;
        }
        else if ("Digital")
        {
            config.binary_input[point].clazz = PointClass::Class1;
            config.binary_input[point].svariation = StaticBinaryVariation::Group1Var2;
            config.binary_input[point].evariation = EventBinaryVariation::Group2Var2;
            mydb::obj().state.binary[point] = false;
        }
        else if ("Double")
        {
            config.double_binary[point].clazz = PointClass::Class1;
            config.double_binary[point].svariation = StaticDoubleBinaryVariation::Group3Var2;
            config.double_binary[point].evariation = EventDoubleBinaryVariation::Group4Var3;
            mydb::obj().state.dbit[point] = DoubleBit::DETERMINED_OFF;
        }
        else if ("Counter")
        {
            config.counter[point].clazz = PointClass::Class3;
            config.counter[point].svariation = StaticCounterVariation::Group20Var5;
            config.counter[point].evariation = EventCounterVariation::Group22Var5;
            mydb::obj().state.count[point] = 0;
        }
    }
    return config;
}

auto app = DefaultOutstationApplication::Create();

void AddUpdates(UpdateBuilder &builder, State &state);

int main(int argc, char *argv[])
{
    if (argc > 0)
    {
        mydb::obj().ID = argv[1];
        mydb::obj().PATH = argv[2];
    }
    else
        return 0;

    ConfigParser();

    // Specify what log levels to use. NORMAL is warning and above
    // You can add all the comms logging by uncommenting below.
    const auto logLevels = levels::NORMAL | levels::ALL_COMMS;

    // This is the main point of interaction with the stack
    // Allocate a single thread to the pool since this is a single outstation
    // Log messages to the console
    DNP3Manager manager(1, FileLogger::Create());

    // Create a TCP server (listener)
    auto channel = std::shared_ptr<IChannel>(nullptr);
    try
    {
        channel = manager.AddTCPServer("server",
                                       logLevels,
                                       ServerAcceptMode::CloseExisting,
                                       IPEndpoint(
                                           mydb::obj().DB_CONFIG["IP"],
                                           std::stoi(mydb::obj().DB_CONFIG["PORT"])),
                                       PrintingChannelListener::Create());
    }
    catch (const std::exception &e)
    {
        std::cerr << e.what() << '\n';
        return -1;
    }

    // The main object for a outstation. The defaults are useable,
    // but understanding the options are important.
    OutstationStackConfig config(ConfigureDatabase());

    // Specify the maximum size of the event buffers
    config.outstation.eventBufferConfig = EventBufferConfig::AllTypes(100);

    // you can override an default outstation parameters here
    // in this example, we've enabled the oustation to use unsolicted reporting
    // if the master enables it
    config.outstation.params.allowUnsolicited = true;

    // You can override the default link layer settings here
    // in this example we've changed the default link layer addressing
    config.link.LocalAddr = std::stoi(mydb::obj().DB_CONFIG["ADDR_LOCAL"]);
    config.link.RemoteAddr = std::stoi(mydb::obj().DB_CONFIG["ADDR_REMOTE"]);
    config.link.KeepAliveTimeout = TimeDuration::Max();

    // Create a new outstation with a log level, command handler, and
    // config info this	returns a thread-safe interface used for
    // updating the outstation's database.
    auto outstation = channel->AddOutstation("outstation",
                                             myCommandHandler::Create(),
                                             app,
                                             config);

    // Enable the outstation and start communications
    outstation->Enable();

    while (true)
    {
        // update measurement values based on input string
        UpdateBuilder builder;
        AddUpdates(builder, mydb::obj().state);
        outstation->Apply(builder.Build());
        sleep(5);
    }

    return 0;
}

void AddUpdates(UpdateBuilder &builder, State &state)
{
    for (int i = 1; i <= 5; i++)
    {
        int point = std::stoi(mydb::obj().DB_CONFIG["POINT" + std::to_string(i)]);
        std::string tid = mydb::obj().DB_CONFIG["TID" + std::to_string(i)];
        std::string automatic = mydb::obj().DB_CONFIG["AUTO" + std::to_string(i)];

        if (tid == "Counter")
        {
            builder.Update(Counter(state.count[point], Flags(0x01), app->Now()), point);
            if (automatic == "true")
                ++state.count[point];
        }
        else if (tid == "Analog")
        {
            builder.Update(Analog(state.value[point], Flags(0x01), app->Now()), point);
            if (automatic == "true")
                state.value[point] += 1;
        }
        else if (tid == "Digital")
        {
            builder.Update(Binary(state.binary[point], Flags(0x01), app->Now()), point);
            if (automatic == "true")
                state.binary[point] = !state.binary[point];
        }
        else if (tid == "Double")
        {
            builder.Update(DoubleBitBinary(state.dbit[point], Flags(0x01), app->Now()), point);
            if (automatic == "true")
            {
                state.dbit[point] = (state.dbit[point] == DoubleBit::DETERMINED_OFF) ? DoubleBit::DETERMINED_ON : DoubleBit::DETERMINED_OFF;
            }
        }
    }
}
