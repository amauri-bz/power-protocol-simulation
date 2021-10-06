/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <opendnp3/ConsoleLogger.h>
#include <opendnp3/DNP3Manager.h>
#include <opendnp3/logging/LogLevels.h>
#include <opendnp3/master/DefaultMasterApplication.h>
#include <opendnp3/master/PrintingCommandResultCallback.h>

#include "fileSOEHandler.h"
#include "fileLogger.h"
#include "db.h"
#include "channelListener.h"

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
    std::ifstream file(mydb::obj().PATH + "\\master_dnp3_config_" + mydb::obj().ID + ".txt");
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
    // You can add all the comms logging by uncommenting below
    const auto logLevels = levels::NORMAL | levels::ALL_APP_COMMS;

    // This is the main point of interaction with the stack
    DNP3Manager manager(1, FileLogger::Create());

    int port = std::stoi(mydb::obj().DB_CONFIG["PORT"]);
    std::string ip = mydb::obj().DB_CONFIG["IP"];

    // Connect via a TCPClient socket to a outstation
    auto channel = manager.AddTCPClient("tcpclient",
                                        logLevels,
                                        ChannelRetry::Default(),
                                        {IPEndpoint(ip, port)},
                                        "0.0.0.0",
                                        channelListener::Create());

    // The master config object for a master. The default are
    // useable, but understanding the options are important.
    MasterStackConfig stackConfig;

    // you can override application layer settings for the master here
    // in this example, we've change the application layer timeout to 2 seconds
    stackConfig.master.responseTimeout = TimeDuration::Seconds(2);
    stackConfig.master.disableUnsolOnStartup = true;

    // You can override the default link layer settings here
    // in this example we've changed the default link layer addressing
    stackConfig.link.LocalAddr = std::stoi(mydb::obj().DB_CONFIG["ADDR_LOCAL"]);
    stackConfig.link.RemoteAddr = std::stoi(mydb::obj().DB_CONFIG["ADDR_REMOTE"]);

    // Create a new master on a previously declared port, with a
    // name, log level, command acceptor, and config info. This
    // returns a thread-safe interface used for sending commands.
    auto master = channel->AddMaster("master",                           // id for logging
                                     fileSOEHandler::Create(),           // callback for data processing
                                     DefaultMasterApplication::Create(), // master application instance
                                     stackConfig                         // stack configuration
    );

    auto test_soe_handler = std::make_shared<fileSOEHandler>();

    // do an integrity poll (Class 3/2/1/0) once per minute
    auto integrityScan = master->AddClassScan(ClassField::AllClasses(),
                                              TimeDuration::Seconds(std::stoi(mydb::obj().DB_CONFIG["GI"])),
                                              test_soe_handler);

    // do Class exception poll
    int class1 = std::stoi(mydb::obj().DB_CONFIG["CLASS1"]);
    int class2 = std::stoi(mydb::obj().DB_CONFIG["CLASS2"]);
    int class3 = std::stoi(mydb::obj().DB_CONFIG["CLASS3"]);

    auto exceptionScan1 = master->AddClassScan(ClassField(ClassField::CLASS_1), TimeDuration::Seconds(class1), test_soe_handler);
    auto exceptionScan2 = master->AddClassScan(ClassField(ClassField::CLASS_2), TimeDuration::Seconds(class2), test_soe_handler);
    auto exceptionScan3 = master->AddClassScan(ClassField(ClassField::CLASS_3), TimeDuration::Seconds(class3), test_soe_handler);

    // Enable the master. This will start communications.
    master->Enable();

    while (true)
    {
        std::cout << "Enter a command" << std::endl;
        std::cout << "i - integrity demand scan" << std::endl;
        std::cout << "e - exception demand scan" << std::endl;
        std::cout << "d - disable unsolicited" << std::endl;
        std::cout << "c - send crob" << std::endl;

        char cmd;
        std::cin >> cmd;
        switch (cmd)
        {
        case ('d'):
            master->PerformFunction("disable unsol", FunctionCode::DISABLE_UNSOLICITED,
                                    {Header::AllObjects(60, 2), Header::AllObjects(60, 3), Header::AllObjects(60, 4)});
            break;
        case ('i'):
            integrityScan->Demand();
            break;
        case ('e'):
            exceptionScan1->Demand();
            break;
        case ('1'):
        {
            ControlRelayOutputBlock crob(OperationType::LATCH_ON);
            master->SelectAndOperate(crob, 1, PrintingCommandResultCallback::Get());
            break;
        }
        case ('2'):
        {
            ControlRelayOutputBlock crob(OperationType::LATCH_ON);
            master->SelectAndOperate(crob, 2, PrintingCommandResultCallback::Get());
            break;
        }
        case ('3'):
        {
            ControlRelayOutputBlock crob(OperationType::LATCH_ON);
            master->SelectAndOperate(crob, 3, PrintingCommandResultCallback::Get());
            break;
        }
        case ('4'):
        {
            ControlRelayOutputBlock crob(OperationType::LATCH_ON);
            master->SelectAndOperate(crob, 4, PrintingCommandResultCallback::Get());
            break;
        }
        case ('5'):
        {
            ControlRelayOutputBlock crob(OperationType::LATCH_ON);
            master->SelectAndOperate(crob, 5, PrintingCommandResultCallback::Get());
            break;
        }
        default:
            std::cout << "Unknown action: " << cmd << std::endl;
            break;
        }
    }

    return 0;
}
