/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <map>
#include <iostream>

#ifndef DB_CONFIG_H
#define DB_CONFIG_H

struct State
{
    std::map<uint32_t, std::tuple<std::string, std::string>> value;
};

class mydb
{
public:
    std::map<std::string, std::string> DB_CONFIG{};
    std::string ID{};
    std::string PATH{};
    State STATE;

    static mydb &obj()
    {
        static mydb instance;
        return instance;
    }

private:
    mydb(){/*...*/};
    mydb(mydb const &other) = delete;
    mydb(mydb &&other) = delete;
};
#endif