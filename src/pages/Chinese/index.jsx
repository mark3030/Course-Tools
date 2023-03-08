import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { useUpload } from '@common/hooks';
import { formatFileSize } from '@common/utils/formatFileSize';
import OSS from 'ali-oss';
import { Button, Card, Col, Input, List, message, Row, Space, Upload } from 'antd';
import React, { useEffect, useState } from "react";

const platfroms = {
    dev: {
        region: "oss-cn-shenzhen",
        bucket: "dtedu-public",
        accessKeyId: "vkwoA5pZk7PdSXg1",
        accessKeySecret: "yRb7qCBRsqM60DS5Pee8AJIEKmYtch",
        prefix: "platform-an/audio/"
    },
};

const Chinese = ({ }) => {
    const { prefix, ...options } = platfroms.dev;
    const [spinning, setLoading] = useState(false);
    const [list, setList] = useState([]);

    const { uploadProps, fileName } = useUpload({
        maxSize: 200,
        type: "audio/mp3",
        setLoading,
        ossData: platfroms.dev
    });


    const resultFilter = (objects = []) => {
        const list = {};
        objects.forEach(item => {
            const { etag, name, lastModified, size, url } = item;
            const keys = name.split('/');
            if (keys.length >= 4) {
                const key = keys[2];
                const [file, ext] = name.substring(name.lastIndexOf('/')).split('.');

                if (!list[key]) list[key] = { name: key };
                if (ext === 'mp3') {
                    const type = file.split('_').pop();
                    list[key][type] = name;
                } else if (ext === 'json') {
                    list[key].json = name;
                    list[key].size = size;
                    list[key].etag = etag
                    list[key].url = url;
                    list[key].lastModified = lastModified
                }
            }
        });
        return Object.values(list);
    };

    useEffect(() => {
        new OSS(options)
            .list({ prefix })
            .then(result => resultFilter(result.objects))
            .then(setList);
    }, []);

    const onSearch = keyword => {
        new OSS(options)
            .list({ prefix: keyword ? `${prefix}${keyword}/` : prefix })
            .then(result => resultFilter(result.objects))
            .then(setList);
    };

    return (
        <List
            dataSource={list}
            style={{ padding: 12 }}
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
            }}
            header={
                <Row>
                    <Col span={8}>
                        <Space>
                            <div>田字格列表</div>
                            <Input.Search
                                placeholder="输入汉字以搜索"
                                allowClear
                                onSearch={onSearch}
                                enterButton
                                style={{
                                    width: 300
                                }}
                            />
                        </Space>
                    </Col>
                    <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                        <Space>
                            <Upload {...uploadProps}>
                                <Button icon={spinning ? <LoadingOutlined /> : <UploadOutlined />} disabled={spinning}>上传田字格音频资源</Button>
                            </Upload>
                        </Space>
                    </Col>
                </Row>
            }
            pagination={{ pageSize: 3 }}
            renderItem={({ json, spell, whole, etag, name, lastModified, size, url }) => (
                <List.Item key={etag}>
                    <Card
                        title={`${name} : ${formatFileSize(size)}`}
                        extra={<Button type='primary' onClick={() => message.info('正在开发中...')}>下载【{name}】动画包</Button>}
                        style={{ boxShadow: '0 0 5px rgba(0, 0, 0, .5)' }}
                    >
                        <iframe
                            style={{
                                width: '100%',
                                height: 700,
                                borderStyle: 'none'
                            }}
                            title={json}
                            src={`https://frontend.dev.dt-pf.com/platform-an/index.html#${name || '%E5%8F%A3'}`}
                        />
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default Chinese;