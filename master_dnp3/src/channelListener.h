/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#ifndef CHANNELLISTENER_H
#define CHANNELLISTENER_H

#include "opendnp3/channel/IChannelListener.h"
#include "opendnp3/util/Uncopyable.h"

#include <iostream>
#include <memory>
#include "db.h"

namespace opendnp3
{

    /**
 * Callback interface for receiving information about a running channel
 */
    class channelListener final : public IChannelListener, private Uncopyable
    {
    public:
        virtual void OnStateChange(ChannelState state) override
        {
            std::cout << "channel state change: " << ChannelStateSpec::to_human_string(state) << std::endl;
            mydb::obj().STATE.value.clear();
        }

        static std::shared_ptr<IChannelListener> Create()
        {
            return std::make_shared<channelListener>();
        }

        channelListener() {}
    };

} // namespace opendnp3

#endif
