/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export class ChatMessageUtils{

  static convertRawMessage(rawMessage, currentThreadID) {
    return {
      id: rawMessage.id,
      type:rawMessage.type,
      conversationId: rawMessage.conversationID,
      fromUid: rawMessage.fromUid,
      fromName:rawMessage.fromName,
      toUid:rawMessage.toUid,
      content: rawMessage.content,
      created: rawMessage.created
    };
  }

  static getCreatedMessageData(text, currentThreadID) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      threadID: currentThreadID,
      authorName: 'Bill', // hard coded for the example
      date: new Date(timestamp),
      text: text,
      isRead: true
    };
  }
};

export default ChatMessageUtils;
