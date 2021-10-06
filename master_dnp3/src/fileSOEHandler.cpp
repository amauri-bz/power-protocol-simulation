/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "fileSOEHandler.h"
#include <chrono>
namespace opendnp3
{

#define AL_OBJ_BI_FLAG0 0x0001 /* Point Online (0=Offline; 1=Online) */
#define AL_OBJ_BI_FLAG1 0x0002 /* Restart (0=Normal; 1=Restart) */
#define AL_OBJ_BI_FLAG2 0x0004 /* Comms Lost (0=Normal; 1=Lost) */
#define AL_OBJ_BI_FLAG3 0x0008 /* Remote Force (0=Normal; 1=Forced) */
#define AL_OBJ_BI_FLAG4 0x0010 /* Local Force (0=Normal; 1=Forced) */

    std::ostream &operator<<(std::ostream &os, const ResponseInfo &info)
    {
        os << "unsolicited: " << info.unsolicited << " fir: " << info.fir << " fin: " << info.fin;
        return os;
    }

    void fileSOEHandler::BeginFragment(const ResponseInfo &info)
    {
        std::cout << "begin response: " << info << std::endl;
    }

    void fileSOEHandler::EndFragment(const ResponseInfo &info)
    {
        std::cout << "end response: " << info << std::endl;
    }

    void fileSOEHandler::Process(const HeaderInfo &info, const ICollection<Indexed<Binary>> &values)
    {
        auto print = [&](const Indexed<Binary> &pair)
        {
            std::ostringstream oss_db;
            std::ostringstream oss_points;

            std::string quality = "";

            if (pair.value.flags.value & AL_OBJ_BI_FLAG0)
                quality.append("Online");
            else
                quality.append("Offline");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG1)
                quality.append(", Restart");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG2)
                quality.append(", Comm Fail");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG3)
                quality.append(", Remote Force");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG4)
                quality.append(", Local Force");

            std::time_t t = pair.value.time.value / 1000;
            char buffer[32] = "0";
            if (pair.value.time.value != 0)
                std::strftime(buffer, 32, "%d.%m.%Y_%H:%M:%S", std::localtime(&t));

            oss_points << "Type:Binary;"
                       << " Point:" << pair.index << ";"
                       << " Value:" << ValueToString(pair.value) << ";"
                       << " Quality:" << quality << ";"
                       << " Time:" << buffer << ";"
                       << std::endl;

            mydb::obj().STATE.value[pair.index] =
                std::make_tuple(ValueToString(pair.value), quality);

            for (auto it = mydb::obj().STATE.value.begin(); it != mydb::obj().STATE.value.end(); it++)
            {
                oss_db << "Type:Binary;"
                       << " Point:" << it->first << ";"
                       << " Value:" << std::get<0>(it->second) << ";"
                       << " Quality:" << std::get<1>(it->second) << ";"
                       << std::endl;
            }

            std::ofstream outfile1;
            outfile1.open(
                mydb::obj().PATH +
                    "\\dnp3_points_" + mydb::obj().ID + ".txt",
                std::ios_base::app);
            outfile1 << oss_points.str();
            outfile1.close();

            std::ofstream outfile2;
            outfile2.open(
                mydb::obj().PATH +
                    "\\dnp3_db_" + mydb::obj().ID + ".txt",
                std::ios_base::trunc);
            outfile2 << oss_db.str();
            outfile2.close();
        };
        values.ForeachItem(print);
    }

    void fileSOEHandler::Process(const HeaderInfo &info, const ICollection<Indexed<DoubleBitBinary>> &values)
    {
        return PrintAll(info, values);
    }

    void fileSOEHandler::Process(const HeaderInfo &info, const ICollection<Indexed<Analog>> &values)
    {
        auto print = [&](const Indexed<Analog> &pair)
        {
            std::ostringstream oss_db;
            std::ostringstream oss_points;

            std::string quality = "";

            if (pair.value.flags.value & AL_OBJ_BI_FLAG0)
                quality.append("Online");
            else
                quality.append("Offline");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG1)
                quality.append(", Restart");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG2)
                quality.append(", Comm Fail");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG3)
                quality.append(", Remote Force");
            if (pair.value.flags.value & AL_OBJ_BI_FLAG4)
                quality.append(", Local Force");

            std::time_t t = pair.value.time.value / 1000;
            char buffer[32] = "0";
            if (pair.value.time.value != 0)
                std::strftime(buffer, 32, "%d.%m.%Y_%H:%M:%S", std::localtime(&t));

            oss_points << "Type:Analog;"
                       << " Point:" << pair.index << ";"
                       << " Value:" << ValueToString(pair.value) << ";"
                       << " Quality:" << quality << ";"
                       << " Time:" << buffer << ";"
                       << std::endl;

            mydb::obj().STATE.value[pair.index] =
                std::make_tuple(ValueToString(pair.value), quality);

            for (auto it = mydb::obj().STATE.value.begin(); it != mydb::obj().STATE.value.end(); it++)
            {
                oss_db << "Type:Analog;"
                       << " Point:" << it->first << ";"
                       << " Value:" << std::get<0>(it->second) << ";"
                       << " Quality:" << std::get<1>(it->second) << ";"
                       << std::endl;
            }

            std::ofstream outfile1;
            outfile1.open(
                mydb::obj().PATH +
                    "\\dnp3_points_" + mydb::obj().ID + ".txt",
                std::ios_base::app);
            outfile1 << oss_points.str();
            outfile1.close();

            std::ofstream outfile2;
            outfile2.open(
                mydb::obj().PATH +
                "\\dnp3_db_" + mydb::obj().ID + ".txt");
            outfile2 << oss_db.str();
            outfile2.close();
        };
        values.ForeachItem(print);
    }

    void fileSOEHandler::Process(const HeaderInfo &info, const ICollection<Indexed<Counter>> &values)
    {
        return PrintAll(info, values);
    }

    void fileSOEHandler::Process(const HeaderInfo &info, const ICollection<Indexed<FrozenCounter>> &values)
    {
        return PrintAll(info, values);
    }

    void fileSOEHandler::Process(const HeaderInfo &info, const ICollection<Indexed<BinaryOutputStatus>> &values)
    {
        return PrintAll(info, values);
    }

    void fileSOEHandler::Process(const HeaderInfo &info, const ICollection<Indexed<AnalogOutputStatus>> &values)
    {
        return PrintAll(info, values);
    }

    void fileSOEHandler::Process(const HeaderInfo & /*info*/, const ICollection<Indexed<OctetString>> &values)
    {
        auto print = [](const Indexed<OctetString> &pair)
        {
            std::cout << "OctetString "
                      << " [" << pair.index << "] : Size : " << pair.value.Size() << std::endl;
        };

        values.ForeachItem(print);
    }

    void fileSOEHandler::Process(const HeaderInfo & /*info*/, const ICollection<Indexed<TimeAndInterval>> &values)
    {
        auto print = [](const Indexed<TimeAndInterval> &pair)
        {
            std::cout << "TimeAndInterval: "
                      << "[" << pair.index << "] : " << pair.value.time.value << " : " << pair.value.interval << " : "
                      << IntervalUnitsSpec::to_human_string(pair.value.GetUnitsEnum()) << std::endl;
        };

        values.ForeachItem(print);
    }

    void fileSOEHandler::Process(const HeaderInfo & /*info*/, const ICollection<Indexed<BinaryCommandEvent>> &values)
    {
        auto print = [](const Indexed<BinaryCommandEvent> &pair)
        {
            std::cout << "BinaryCommandEvent: "
                      << "[" << pair.index << "] : " << pair.value.time.value << " : " << pair.value.value << " : "
                      << CommandStatusSpec::to_human_string(pair.value.status) << std::endl;
        };

        values.ForeachItem(print);
    }

    void fileSOEHandler::Process(const HeaderInfo & /*info*/, const ICollection<Indexed<AnalogCommandEvent>> &values)
    {
        auto print = [](const Indexed<AnalogCommandEvent> &pair)
        {
            std::cout << "AnalogCommandEvent: "
                      << "[" << pair.index << "] : " << pair.value.time.value << " : " << pair.value.value << " : "
                      << CommandStatusSpec::to_human_string(pair.value.status) << std::endl;
        };

        values.ForeachItem(print);
    }

    void fileSOEHandler::Process(const HeaderInfo & /*info*/, const ICollection<DNPTime> &values)
    {
        auto print = [](const DNPTime &value)
        { std::cout << "DNPTime: " << value.value << std::endl; };

        values.ForeachItem(print);
    }

} // namespace opendnp3
