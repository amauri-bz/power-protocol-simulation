/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#ifndef OPENDNP3_SIMPLECOMMANDHANDLER_H
#define OPENDNP3_SIMPLECOMMANDHANDLER_H

#include "opendnp3/outstation/ICommandHandler.h"

#include <memory>

namespace opendnp3
{

    /**
 * Mock ICommandHandler used for examples and demos
 */
    class commandHandler : public ICommandHandler
    {
    public:
        /**
     * @param status The status value to return in response to all commands
     */
        commandHandler(CommandStatus status);

        virtual void Begin() override;
        virtual void End() override;

        CommandStatus Select(const ControlRelayOutputBlock &command, uint16_t index) override;
        CommandStatus Operate(const ControlRelayOutputBlock &command,
                              uint16_t index,
                              IUpdateHandler &handler,
                              OperateType opType) override;

        CommandStatus Select(const AnalogOutputInt16 &command, uint16_t index) override;
        CommandStatus Operate(const AnalogOutputInt16 &command,
                              uint16_t index,
                              IUpdateHandler &handler,
                              OperateType opType) override;

        CommandStatus Select(const AnalogOutputInt32 &command, uint16_t index) override;
        CommandStatus Operate(const AnalogOutputInt32 &command,
                              uint16_t index,
                              IUpdateHandler &handler,
                              OperateType opType) override;

        CommandStatus Select(const AnalogOutputFloat32 &command, uint16_t index) override;
        CommandStatus Operate(const AnalogOutputFloat32 &command,
                              uint16_t index,
                              IUpdateHandler &handler,
                              OperateType opType) override;

        CommandStatus Select(const AnalogOutputDouble64 &command, uint16_t index) override;
        CommandStatus Operate(const AnalogOutputDouble64 &command,
                              uint16_t index,
                              IUpdateHandler &handler,
                              OperateType opType) override;

    protected:
        virtual void DoSelect(const ControlRelayOutputBlock &command, uint16_t index) {}
        virtual void DoOperate(const ControlRelayOutputBlock &command, uint16_t index, OperateType opType) {}

        virtual void DoSelect(const AnalogOutputInt16 &command, uint16_t index) {}
        virtual void DoOperate(const AnalogOutputInt16 &command, uint16_t index, OperateType opType) {}

        virtual void DoSelect(const AnalogOutputInt32 &command, uint16_t index) {}
        virtual void DoOperate(const AnalogOutputInt32 &command, uint16_t index, OperateType opType) {}

        virtual void DoSelect(const AnalogOutputFloat32 &command, uint16_t index) {}
        virtual void DoOperate(const AnalogOutputFloat32 &command, uint16_t index, OperateType opType) {}

        virtual void DoSelect(const AnalogOutputDouble64 &command, uint16_t index) {}
        virtual void DoOperate(const AnalogOutputDouble64 &command, uint16_t index, OperateType opType) {}

        CommandStatus status;

    public:
        uint32_t numOperate;
        uint32_t numSelect;
        uint32_t numStart;
        uint32_t numEnd;
    };

    /**
 * A singleton command handler that always returns success
 */
    class myCommandHandler : public commandHandler
    {
    public:
        static std::shared_ptr<ICommandHandler> Create()
        {
            return std::make_shared<myCommandHandler>();
        }

        myCommandHandler() : commandHandler(CommandStatus::SUCCESS) {}
    };

} // namespace opendnp3

#endif
