import jsonFormat from 'json-format';
import MarkDown from './MarkDown';

const formatConfig = {
  type: 'space',
  size: 2
};

function convertToMD(obj) {
  if (typeof obj === 'string') {
    try {
      obj = JSON.parse(obj);
    } catch (err) {
      obj = {};
    }
  }

  if (typeof obj !== 'object') {
    obj = {};
  }

  return '```json\n' + jsonFormat(obj, formatConfig) + '\n```';
}


export default function ({ json, mdStyles ={} }) {
  // if(!mdStyles.border) {
  //   mdStyles.border = '1px soild #e8e8e8';
  // }
  return <MarkDown mdStyles={mdStyles} md={convertToMD(json)} />
}