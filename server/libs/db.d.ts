/*
 * @Author: maple
 * @Date: 2020-11-18 15:47:50
 * @LastEditors: maple
 * @LastEditTime: 2020-11-18 16:06:38
 */
import { Toshihiko, Model } from 'toshihiko'


declare class ToshihikoQ extends Toshihiko {
  qdefine(collectionName: string, schema: any[], options?: any): Model;
}
declare function get(name: string): ToshihikoQ;
declare function modelGet(tableName: string): Model;