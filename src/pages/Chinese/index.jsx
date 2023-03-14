import Tianzige from '@/components/Tianzige';
import { DownloadOutlined, LoadingOutlined, QuestionCircleOutlined, ThunderboltOutlined, UploadOutlined } from '@ant-design/icons';
import { useHanzi, usePackage, useUpload } from '@common/hooks';
import { formatFileSize } from '@common/utils/formatFileSize';
import OSS from 'ali-oss';
import { Alert, Button, Card, Col, Input, List, Modal, Row, Space, Tooltip, Upload } from 'antd';
import React, { useEffect, useState } from "react";
import './index.page.less';

const platfroms = {
    dev: {
        region: "oss-cn-shenzhen",
        bucket: "dtedu-public",
        accessKeyId: "vkwoA5pZk7PdSXg1",
        accessKeySecret: "yRb7qCBRsqM60DS5Pee8AJIEKmYtch",
        prefix: "platform-an/audio/"
    },
};

const HELPER = {
    upload: (
        <div>
            <p>
                <h2>文件上传：</h2>
                上传音频文件，支持重复上传，批量上传
                <h3>特别注意：上传过程会自动生成动画文件和数据，上传后无需再次点击“生成动画”</h3>
            </p>
            <p>
                <h2>命名规范：</h2>
                [汉字]_[拼音]_[点读类型].mp3
            </p>
            <p>
                <h2>范例：</h2>
                <ul>
                    <li>地_di_spell.mp3 - 汉字【地】的"di"发音的拼读音频 </li>
                    <li>地_di_whole.mp3 - 汉字【地】的"di"发音的整读音频 </li>
                    <li>地_de_spell.mp3 - 汉字【地】的"de"发音的拼读音频 </li>
                    <li>地_de_whole.mp3 - 汉字【地】的"de"发音的整读音频 </li>
                </ul>
            </p>
        </div>
    ),
    generate: (
        <div>
            <p>
                <h2>生成动画：</h2>
                根据已经上传好的音频文件生成动画
            </p>
            <p>
                <h2>下载动画包：</h2>
                将确认无误的动画打包成 *.an.zip 的压缩包并下载
            </p>
        </div>
    ),
    search: (
        <div>
            <p>
                <h2>搜索动画</h2>
                输入汉字作为关键字，点击搜索
            </p>
            <p>
                鉴于程序性能问题并不会把所有动画全部列出来，因此需要通过搜索来找到需要的动画。
            </p>
        </div>
    )
};

const resultFilter = (objects = []) => {
    const list = {};
    objects.forEach(item => {
        const { etag, name, lastModified, size = 0 } = item;
        const keys = name.split('/');
        if (keys.length >= 4) {
            const [ character, file ] = keys.slice(2);
            const [ fileName, ext ] = file.split('.');

            if (!list[character]) {
                list[character] = {
                    character,
                    lastModified,
                    size
                };
            }

            if (ext === 'mp3') {
                // 一_yī_spell.mp3
                const [ character_, pinyin, type ] = fileName.split('_');
                list[character][type] = name;
                list[character].pinyin = pinyin;
            } else if (ext === 'json') {
                // 一.json
                list[character].json = name;
                list[character].size = size;
                list[character].etag = etag
            }
        }
    });
    return Object.values(list);
};

const Chinese = ({ }) => {
    const { prefix, ...options } = platfroms.dev;
    const [initialization, setInitialization] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => onSearch(), []);

    const onSearch = keyword => {
        new OSS(options)
            .list({ prefix: keyword ? `${prefix}${keyword}/` : prefix })
            .then(result => resultFilter(result.objects))
            .then(setList);
    };

    const { generateAnimate } = useHanzi({
        base: 'templates',
        graphicsLib: "makemeahanzi/graphics.dev.txt",
        ossData: platfroms.dev,
        completed: setInitialization
    });
    const { uploadRequest, uploadProps } = useUpload({
        multiple: true,
        maxSize: 200,
        type: "audio/mp3,audio/mpeg",
        ossData: platfroms.dev,
        generateFolder: generateAnimate,
        startd: setUploading,
        completed: onSearch
    });
    const { graphicsData, genPackage } = usePackage({
        thumbContainer: '#tianzige_thumb_container',
        ossData: platfroms.dev,
    });

    return (
        <>
            {initialization && <Alert type="warning" showIcon icon={<LoadingOutlined />} message="重要说明：" description="程序正在初始化，请稍后..."/>}
            <List
                dataSource={list}
                grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
                header={
                    <Row
                        gutter={[ 16, { xs: 8, sm: 16, md: 24, lg: 32 } ]}
                        justify="space-between"
                    >
                        <Col xs={24} sm={12} md={16} lg={8} xl={8}>
                            <Space>
                                <Input.Search
                                    placeholder="输入汉字以搜索"
                                    allowClear
                                    onSearch={onSearch}
                                    enterButton
                                />
                                <Tooltip title={HELPER.search} style={{ width: 300 }}>
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Tooltip title={HELPER.upload} style={{ width: 500 }}>
                                    <QuestionCircleOutlined />
                                </Tooltip>
                                <Upload {...uploadProps}>
                                    <Button type='primary' icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} disabled={uploading || initialization}>上传田字格音频资源</Button>
                                </Upload>
                            </Space>
                        </Col>
                    </Row>
                }
                pagination={{ pageSize: 3 }}
                renderItem={item => {
                    const { json = null, etag, character, pinyin, size } = item;
                    return (
                        <List.Item key={etag}>
                            <Card
                                title={`${character}(${pinyin}) : ${formatFileSize(size)}`}
                                extra={
                                    <Space>
                                        <Tooltip title={HELPER.generate} style={{ width: 300 }}>
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                        <Button type='primary' onClick={() => uploadRequest(item)} disabled={initialization} icon={<ThunderboltOutlined />}/>
                                        <Button type='default' onClick={() => genPackage(item, true)} disabled={initialization} shape="circle" icon={<DownloadOutlined />}/>
                                    </Space>
                                    
                                }
                                style={{ boxShadow: '0 0 5px rgba(0, 0, 0, .5)' }}
                            >
                                {
                                    json
                                    ? <iframe style={{ width: '100%', height: 700, borderStyle: 'none' }} title={json} src={`https://frontend.dev.dt-pf.com/platform-an/demo/index.html#${character || '%E5%8F%A3'}`}/>
                                    : <Button type="primary" onClick={() => uploadRequest(item)} disabled={initialization} block style={{ height: 180 }}>点击生成动画</Button>
                                }
                            </Card>
                        </List.Item>
                    )
                }}
            />
            <Modal
                open={!!graphicsData.strokes}
                closable={false}
                footer={null}
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Tianzige
                    spinning={true}
                    {...graphicsData}
                />
            </Modal>
        </>
    );
};

export default Chinese;