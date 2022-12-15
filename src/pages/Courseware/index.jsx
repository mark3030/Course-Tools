import { formatFileSize } from '@common/utils/formatFileSize';
import OSS from 'ali-oss';
import { Button, Col, List, Radio, Row } from 'antd';
import React, { useEffect, useState } from "react";

// const ENDPOINT = "oss-cn-shenzhen";
// const DEFAULT_BUCKET = "ediacaran";
// const ACCESS_KEY = "LTAIC3GffIXUFtwG";
// const SECRET_KEY = "v6OSaj6S54bQesM8FGG1nWcbyzNN1z";

const platfroms = {
    custom: {
        region: "oss-cn-shenzhen",
        bucket: "ediacaran",
        accessKeyId: "LTAIC3GffIXUFtwG",
        accessKeySecret: "v6OSaj6S54bQesM8FGG1nWcbyzNN1z",

        prefix: "office365/data/",
        i: 30516
    },
    test: {
        region: "oss-cn-shenzhen",
        bucket: "dtedu-public",
        accessKeyId: "vkwoA5pZk7PdSXg1",
        accessKeySecret: "yRb7qCBRsqM60DS5Pee8AJIEKmYtch",

        prefix: "office365/data/",
        i: 30516
    },
    online: {
        region: "oss-cn-beijing",
        bucket: "platform-prod-private",
        accessKeyId: "LTAI4G5qD9cKKtdPApKiMpHE",
        accessKeySecret: "TVSaRu9xiqYe4o0BUoLUdP4MPoztYo",

        prefix: "platform-file/office365/data/",
        i: 30555
    }
};

export default () => {
    const [list, setList] = useState([]);
    const [mode, setMode] = useState({
        type: "test",
        prefix: "office365/data/",
        i: 30516
    });

    useEffect(() => {
        handleModeChange(mode.type);
    }, []);

    const handleModeChange = type => {
        const { i, prefix, ...options } = platfroms[type];

        new OSS(options)
            .list({ prefix })
            .then(result => {
                const list = [];
                result.objects.forEach(item => {
                    let { name, size, url } = item;
                    url = url.replace("platform-prod-private.oss-cn-beijing.aliyuncs.com", "cdn.dt-pf.com");
                    const pact = url.split('://');
                    const ssl = pact[0] === "http" ? 0 : 1;
                    const extIndex = name.lastIndexOf('.');
                    const ext = name.substring(extIndex);
                    if(['.ppt', '.pptx'].includes(ext)) {
                        list.push({ name, size, url, n: 5, ssl });
                    } else if(['.doc', '.docx'].includes(ext)) {
                        list.push({ name, size, url, n: 3, ssl });
                    }
                });
                return list;
            })
            .then(setList);
            
        setMode({ type, prefix, i });
    };

    return (
        <List
            dataSource={list}
            style={{ margin: 50 }}
            header={
                <Row>
                    <Col span={8}>课件列表</Col>
                    <Col span={8} offset={8} style={{textAlign: 'right'}}>
                        <Radio.Group onChange={e => handleModeChange(e.target.value)} value={mode.type} style={{ marginBottom: 8 }}>
                            <Radio.Button value="test">测试环境</Radio.Button>
                            <Radio.Button value="online">正式环境</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
            }
            pagination={true}
            renderItem={item => 
                <List.Item key={item.etag}>
                    <List.Item.Meta
                        title={item.name.replace(mode.prefix, "")}
                        description={formatFileSize(item.size)}
                    />
                    <Button href={`https://itest.ow365.cn/?i=${mode.i}&n=${item.n}&ssl=${item.ssl}&furl=${item.url}`} target="_blank">OW365测试环境</Button>
                    <Button href={`https://ow365.cn/?i=${mode.i}&n=${item.n}&ssl=${item.ssl}&furl=${item.url}`} target="_blank">OW365正式环境</Button>
                    <Button href={`http://office.necibook.com:8884/?pct=1&officeType=zjyz&n=${item.n}&ssl=${item.ssl}&furl=${item.url}`} target="_blank">中教云打开</Button>
                    <Button href={`https://view.officeapps.live.com/op/view.aspx?src=${item.url}`} target="_blank">微软打开</Button>
                </List.Item>
            }
        />
    );
};