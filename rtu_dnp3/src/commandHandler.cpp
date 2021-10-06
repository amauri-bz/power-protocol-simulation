/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include "commandHandler.h"
#include "db.h"

namespace opendnp3
{

    commandHandler::commandHandler(CommandStatus status)
        : status(status), numOperate(0), numSelect(0), numStart(0), numEnd(0)
    {
    }

    void commandHandler::Begin()
    {
        ++numStart;
    }

    void commandHandler::End()
    {
        ++numEnd;
    }

    CommandStatus commandHandler::Select(const ControlRelayOutputBlock &command, uint16_t index)
    {
        this->DoSelect(command, index);
        ++numSelect;
        return status;
    }
    CommandStatus commandHandler::Operate(const ControlRelayOutputBlock &command,
                                          uint16_t index,
                                          IUpdateHandler &handler,
                                          OperateType opType)
    {
        this->DoOperate(command, index, opType);
        ++numOperate;

        mydb::obj().state.binary[index] = !mydb::obj().state.binary[index];
        return status;
    }

    CommandStatus commandHandler::Select(const AnalogOutputInt16 &command, uint16_t index)
    {
        this->DoSelect(command, index);
        ++numSelect;
        return status;
    }
    CommandStatus commandHandler::Operate(const AnalogOutputInt16 &command,
                                          uint16_t index,
                                          IUpdateHandler &handler,
                                          OperateType opType)
    {
        this->DoOperate(command, index, opType);
        ++numOperate;
        return status;
    }

    CommandStatus commandHandler::Select(const AnalogOutputInt32 &command, uint16_t index)
    {
        this->DoSelect(command, index);
        ++numSelect;
        return status;
    }
    CommandStatus commandHandler::Operate(const AnalogOutputInt32 &command,
                                          uint16_t index,
                                          IUpdateHandler &handler,
                                          OperateType opType)
    {
        this->DoOperate(command, index, opType);
        ++numOperate;
        return status;
    }

    CommandStatus commandHandler::Select(const AnalogOutputFloat32 &command, uint16_t index)
    {
        this->DoSelect(command, index);
        ++numSelect;
        return status;
    }
    CommandStatus commandHandler::Operate(const AnalogOutputFloat32 &command,
                                          uint16_t index,
                                          IUpdateHandler &handler,
                                          OperateType opType)
    {
        this->DoOperate(command, index, opType);
        ++numOperate;
        return status;
    }

    CommandStatus commandHandler::Select(const AnalogOutputDouble64 &command, uint16_t index)
    {
        this->DoSelect(command, index);
        ++numSelect;
        return status;
    }
    CommandStatus commandHandler::Operate(const AnalogOutputDouble64 &command,
                                          uint16_t index,
                                          IUpdateHandler &handler,
                                          OperateType opType)
    {
        this->DoOperate(command, index, opType);
        ++numOperate;
        return status;
    }

} // namespace opendnp3
