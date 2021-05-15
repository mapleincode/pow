import { Descriptions } from 'antd';
import Block from './Block';

export default function (props) {
    const datas = props.datas || props.childrens;
    const name = props.name;

    return <Block name={name}>
        <Descriptions layout="vertical">
            {datas.map(data =>
                (<Descriptions.Item label={data.label} >
                    {data.value}
                </Descriptions.Item>))}
        </Descriptions>
    </Block>
}
