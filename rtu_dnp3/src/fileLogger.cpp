/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include "FileLogger.h"

#include "logging/ConsolePrettyPrinter.h"

#include "opendnp3/logging/LogLevels.h"
#include "db.h"

#include <cassert>
#include <chrono>
#include <iostream>
#include <sstream>
#include <fstream>

namespace opendnp3
{

    void FileLogger::log(ModuleId module, const char *id, LogLevel level, char const *location, char const *message)
    {
        auto time = std::chrono::high_resolution_clock::now();
        auto num = std::chrono::duration_cast<std::chrono::milliseconds>(time.time_since_epoch()).count();

        std::ostringstream oss;

        oss << "ms(" << num << ") " << LogFlagToString(level);
        oss << " " << id;
        if (printLocation)
        {
            oss << " - " << location;
        }
        oss << " - " << message;

        std::unique_lock<std::mutex> lock(mutex);

        std::ofstream outfile;
        outfile.open(
            mydb::obj().PATH + "\\dnp3_out_" + mydb::obj().ID + ".txt",
            std::ios_base::app);
        outfile << oss.str() << std::endl;
        outfile.close();
    }

} // namespace opendnp3
