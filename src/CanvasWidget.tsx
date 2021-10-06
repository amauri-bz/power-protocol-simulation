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

export interface DemoCanvasWidgetProps {
	color?: string;
	background?: string;
}

export const Container = styled.div<{ color: string; background: string }>`
    height: 100%;
    background-color: rgb(60, 60, 60) !important;
    background-size: 50px 50px;
    display: flex;
    > * {
        height: 100%;
        min-height: 100%;
        width: 100%;
    }
    background-image: linear-gradient(
            0deg,
            transparent 24%,
            ${p => p.color} 25%,
            ${p => p.color} 26%,
            transparent 27%,
            transparent 74%,
            ${p => p.color} 75%,
            ${p => p.color} 76%,
            transparent 77%,
            transparent
        ),
        linear-gradient(
            90deg,
            transparent 24%,
            ${p => p.color} 25%,
            ${p => p.color} 26%,
            transparent 27%,
            transparent 74%,
            ${p => p.color} 75%,
            ${p => p.color} 76%,
            transparent 77%,
            transparent
        );
`;

export class DemoCanvasWidget extends React.Component<DemoCanvasWidgetProps> {
	render() {
		return (
			<Container
				background={this.props.background || 'rgb(60, 60, 60)'}
				color={this.props.color || 'rgba(255,255,255, 0.05)'}>
				{this.props.children}
			</Container>
		);
	}
}