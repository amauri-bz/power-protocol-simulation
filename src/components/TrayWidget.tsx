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

export const Tray = styled.div`
    min-width: 200px;
    background: rgb(20, 20, 20);
    flex-grow: 0;
    flex-shrink: 0;
`;

export class TrayWidget extends React.Component {
	render() {
		return <Tray>{this.props.children}</Tray>;
	}
}