/*
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import styled from '@emotion/styled';

export interface TrayItemWidgetProps {
	model: any;
	color?: string;
	name: string;
}

export const Tray = styled.div<{ color: string }>`
    color: white;
    font-family: Helvetica, Arial;
    padding: 5px;
    margin: 0px 10px;
    border: solid 1px ${(p) => p.color};
    border-radius: 5px;
    margin-bottom: 2px;
    cursor: pointer;
`;

export class TrayItemWidget extends React.Component<TrayItemWidgetProps> {
	render() {
		return (
			<Tray
				color="#fff"
				draggable={true}
				onDragStart={(event) => {
					event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
				}}
				className="tray-item">
				{this.props.name}
			</Tray>
		);
	}
}