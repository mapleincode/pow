import { Divider } from 'antd';

export default function ({ children, name, maxWidth='800px' }) {
    return <div style={{
        border: '1px solid #ebedf0',
        borderRadius: '2px',
        padding: '12px 24px 12px 24px',
        maxwidth: maxWidth
    }}>
        { name ? <Divider orientation="left">{name}</Divider> : '' }
        { children }
    </div>
}