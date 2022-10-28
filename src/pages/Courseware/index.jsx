import OSS from 'ali-oss';
import { Button, List } from 'antd';
import React, { useEffect, useState } from "react";

// const ENDPOINT = "oss-cn-shenzhen";
// const DEFAULT_BUCKET = "ediacaran";
// const ACCESS_KEY = "LTAIC3GffIXUFtwG";
// const SECRET_KEY = "v6OSaj6S54bQesM8FGG1nWcbyzNN1z";

const ENDPOINT = "oss-cn-shenzhen";
const DEFAULT_BUCKET = "dtedu-public";
const ACCESS_KEY = "vkwoA5pZk7PdSXg1";
const SECRET_KEY = "yRb7qCBRsqM60DS5Pee8AJIEKmYtch";

const CDN_HOST = "https://public.data.dev.dt-pf.com";


export default () => {
    const [list, setList] = useState([]);
    const prefix = "courseware-2022-10-19/";

    useEffect(() => {
        const client = new OSS({
            region: ENDPOINT,
            accessKeyId: ACCESS_KEY,
            accessKeySecret: SECRET_KEY,
            bucket: DEFAULT_BUCKET
          });

        client.list({ prefix: prefix })
            .then(result => {
                const list = [];
                result.objects.forEach(item => {
                    const { name, url } = item;
                    const extIndex = name.lastIndexOf('.');
                    const ext = name.substring(extIndex);
                    if(['.ppt', '.pptx'].includes(ext)) {
                        list.push(item);
                    }
                });
                return list;
            })
            .then(setList);
    }, []);

    return (
        <List
            dataSource={list}
            style={{ margin: 50 }}
            header={<div>课件列表</div>}
            pagination={true}
            renderItem={item => 
                <List.Item key={item.etag}>
                    <List.Item.Meta title={item.name.replace(prefix, "")}/>
                    <Button href={`http://office.necibook.com:8884/?pct=1&officeType=zjyz&n=1&furl=${item.url}`} target="_blank">中教云打开</Button>
                    <Button href={`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`} target="_blank">免费微软方案打开</Button>
                </List.Item>
            }
        />
    );
};