/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const db_rtu = require("./DbRtu");

const readLastLine = require("read-last-line");

//==========================================================
// Read 20 lines of trace and send to RTU window
//==========================================================
function readDataRtu(item) {
  if (item.window != null && item.state === "running") {
    readLastLine.read(item.simulator_log, 20).then(function (lines) {
      item.window.webContents.send("rtu-message", { msg: "data", log: lines });
    });
  }
}

//==========================================================
// Start a Scheduler
//==========================================================
function dataProviderRtu() {
  setTimeout(function () {
    db_rtu.get_rtu_all().forEach(readDataRtu);
    dataProviderRtu();
  }, 1000);
}

exports.dataProviderRtu = dataProviderRtu;