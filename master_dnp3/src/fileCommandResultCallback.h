/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#ifndef OPENDNP3_FILECOMMANDRESULTCALLBACK_H
#define OPENDNP3_FILECOMMANDRESULTCALLBACK_H

#include "opendnp3/util/StaticOnly.h"

#include "opendnp3/master/CommandResultCallbackT.h"

namespace opendnp3
{

    class fileCommandResultCallback : public StaticOnly
    {

    public:
        static CommandResultCallbackT Get();
    };

} // namespace opendnp3

#endif
