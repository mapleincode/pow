import 'highlight.js/styles/tomorrow.css';
import myMarked from '@/utils/marked';

export default ({ md = '', mdStyles={} }) => {
    return <div style={mdStyles} dangerouslySetInnerHTML={{ __html: myMarked(md) }} />
}