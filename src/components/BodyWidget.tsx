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
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { Application } from "../Diagram";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel } from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { DemoCanvasWidget } from "../CanvasWidget";
import styled from "@emotion/styled";

export interface BodyWidgetProps {
  app: Application;
}

export const Body = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Header = styled.div`
  display: flex;
  background: rgb(30, 30, 30);
  flex-grow: 0;
  flex-shrink: 0;
  color: white;
  font-family: Helvetica, Arial, sans-serif;
  padding: 10px;
  align-items: center;
`;

export const Content = styled.div`
  display: flex;
  flex-grow: 1;
`;

export const Layer = styled.div`
  position: relative;
  flex-grow: 1;
`;

//6) render the diagram!
const FullscreenCanvas = styled(DemoCanvasWidget)`
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  height: 95vh;
`;

export class BodyWidget extends React.Component<BodyWidgetProps> {
  render() {
    return (
      <Body>
        <Header>
          <div className="title">Power System Protocol Simulation:</div>
        </Header>
        <Content>
          <TrayWidget>
            <TrayItemWidget
              model={{ type: "in_dnp" }}
              name="DNP3-Master"
              color="rgb(192,255,0)"
            />
            <TrayItemWidget
              model={{ type: "out_dnp" }}
              name="DNP3-RTU"
              color="rgb(0,192,255 )"
            />
          </TrayWidget>
          <Layer
            onDrop={(event) => {
              var data = JSON.parse(
                event.dataTransfer.getData("storm-diagram-node")
              );
              var nodesCount = _.keys(
                this.props.app.getDiagramEngine().getModel().getNodes()
              ).length;

              var node: DefaultNodeModel;
              if (data.type === "in_dnp") {
                node = new DefaultNodeModel(
                  "DNP3-Master-" + (nodesCount + 1),
                  "rgb(155,89,182)"
                );
                node.addInPort("port1");
                node.addInPort("port2");
                node.addInPort("port3");
              } else {
                node = new DefaultNodeModel(
                  "DNP3-RTU-" + (nodesCount + 1),
                  "rgb(202,111,30)"
                );
                node.addOutPort("Out");
              }
              var point = this.props.app
                .getDiagramEngine()
                .getRelativeMousePoint(event);
              node.setPosition(point);
              this.props.app.getDiagramEngine().getModel().addNode(node);
              this.forceUpdate();
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
          >
            <Container>
              <FullscreenCanvas>
                <CanvasWidget engine={this.props.app.getDiagramEngine()} />
              </FullscreenCanvas>
            </Container>
          </Layer>
        </Content>
      </Body>
    );
  }
}
