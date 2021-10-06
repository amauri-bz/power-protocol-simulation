/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import * as SRD from "@projectstorm/react-diagrams";
import { BodyWidget } from "./components/BodyWidget";
const { ipcRenderer } = window.require("electron");

export class Application {
  protected activeModel!: SRD.DiagramModel;
  protected diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = SRD.default();
    this.newModel();
  }

  public send(msg: any): any {
    console.log("Cliente: ", msg);

    return new Promise((resolve) => {
      ipcRenderer.once("get_" + msg.type + "_reply", (_: any, arg: any) => {
        console.log("get_data:", arg);
      });
      ipcRenderer.send("diagram-message", msg);
    });
  }

  public newModel() {
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setModel(this.activeModel);

    this.activeModel.registerListener({
      eventDidFire: (e: any) => {
        console.log("eventDidFire", e);
        const node = e.node;
        if (node) {
          node.registerListener({
            selectionChanged: (e: any) => {
              if (e.isSelected === true) {
                console.log("selectionChanged", e);
                this.send({
                  msg: "init",
                  type: e.entity.options.name,
                  id: e.entity.options.id,
                });
              }
            },
            entityRemoved: (e: any) => {
              console.log("entityRemoved", e);
              this.send({
                msg: "delete",
                type: e.entity.options.name,
                id: e.entity.options.id,
              });
            },
          });
        }
        const link = e.link;
        if (link) {
          link.registerListener({
            targetPortChanged: (e: any) => {
              console.log("targetPortChanged", e);
              if (e.entity.sourcePort && e.entity.targetPort) {
                let target = e.entity.targetPort
                let source = e.entity.sourcePort;

                if(target.options.name === "Out") {
                  target = e.entity.sourcePort
                  source = e.entity.targetPort;
                }

                this.send({
                  msg: "link",
                  source_id: source.parent.options.id,
                  source_name: source.parent.options.name,

                  target_id: target.parent.options.id,
                  target_name: target.parent.options.name,
                  target_port_name: target.options.name,
                });
              }
            },
          });
        }
      },
    });
  }

  public getActiveDiagram(): SRD.DiagramModel {
    return this.activeModel;
  }

  public getDiagramEngine(): SRD.DiagramEngine {
    return this.diagramEngine;
  }
}

function Diagram() {
  var app = new Application();
  return <BodyWidget app={app} />;
}

export default Diagram;
