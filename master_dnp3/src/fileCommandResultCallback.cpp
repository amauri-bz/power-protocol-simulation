/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "fileCommandResultCallback.h"

#include <iostream>

namespace opendnp3
{

    CommandResultCallbackT fileCommandResultCallback::Get()
    {
        return [](const ICommandTaskResult &result) -> void
        {
            std::cout << "Received command result w/ summary: " << TaskCompletionSpec::to_human_string(result.summary)
                      << std::endl;
            auto print = [](const CommandPointResult &res)
            {
                std::cout << "Header: " << res.headerIndex << " Index: " << res.index
                          << " State: " << CommandPointStateSpec::to_human_string(res.state)
                          << " Status: " << CommandStatusSpec::to_human_string(res.status);
            };
            result.ForeachItem(print);
        };
    }

} // namespace opendnp3
