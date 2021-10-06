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

export interface DemoWorkspaceWidgetProps {
	buttons?: any;
}

export const Toolbar = styled.div`
    padding: 5px;
    display: flex;
    flex-shrink: 0;
`;

export const Content = styled.div`
    flex-grow: 1;
    height: 100%;
`;

export const Container = styled.div`
    background: black;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
`;

export const DemoButton = styled.button`
	background: rgb(60, 60, 60);
	font-size: 14px;
	padding: 5px 10px;
	border: none;
	color: white;
	outline: none;
	cursor: pointer;
	margin: 2px;
	border-radius: 3px;
	&:hover {
		background: rgb(0, 192, 255);
	}
`;

export class DemoWorkspaceWidget extends React.Component<DemoWorkspaceWidgetProps> {
	render() {
		return (
			<Container>
				<Toolbar>{this.props.buttons}</Toolbar>
				<Content>{this.props.children}</Content>
			</Container>
		);
	}
}