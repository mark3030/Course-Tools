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
        graphicsLib: "makemeahanzi/graphics.txt",
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
            {/* <Tianzige
                    pinyin="biǎn"
                    strokes={[
                        "M 450 833 Q 437 834 435 827 Q 431 820 441 809 Q 508 728 552 722 Q 561 721 566 725 Q 570 729 574 747 Q 575 763 570 780 Q 549 819 450 833 Z",
                        "M 657 535 Q 690 601 720 614 Q 738 633 723 652 Q 707 665 653 693 Q 634 702 612 693 Q 518 651 377 622 C 348 616 360 580 389 587 Q 420 594 595 640 Q 617 647 627 637 Q 633 630 630 615 Q 617 573 602 539 C 590 511 643 508 657 535 Z",
                        "M 348 459 Q 363 447 387 452 Q 477 476 672 499 Q 682 500 684 510 Q 684 519 657 535 C 636 548 631 547 602 539 Q 466 503 355 485 C 325 480 322 474 348 459 Z",
                        "M 311 344 Q 332 402 348 459 L 355 485 Q 362 516 372 544 Q 376 563 384 579 Q 387 583 389 587 C 398 604 398 604 377 622 Q 365 635 347 646 Q 329 659 316 656 Q 303 652 307 636 Q 319 609 313 558 Q 261 332 207 229 Q 147 126 55 22 Q 48 16 46 10 Q 42 0 53 0 Q 86 0 179 106 Q 200 131 220 160 Q 262 224 296 303 L 311 344 Z",
                        "M 338 334 Q 331 341 311 344 C 283 350 288 332 296 303 Q 317 237 299 126 Q 281 65 311 31 Q 318 19 328 25 Q 352 47 353 167 Q 350 270 351 299 C 352 326 352 326 338 334 Z",
                        "M 617 351 Q 666 358 765 367 Q 778 368 783 361 Q 790 355 789 322 Q 788 180 766 100 Q 754 60 721 68 Q 694 72 670 75 Q 654 81 654 74 Q 653 67 664 52 Q 722 -12 737 -43 Q 744 -58 754 -56 Q 767 -55 781 -33 Q 805 1 816 41 Q 834 95 859 291 Q 863 327 876 345 Q 895 366 881 372 Q 865 388 826 407 Q 802 423 776 413 Q 749 404 681 395 Q 551 379 465 360 Q 401 344 338 334 C 308 329 322 291 351 299 Q 360 300 368 303 Q 389 312 431 317 L 471 327 Q 523 337 572 345 L 617 351 Z",
                        "M 628 210 Q 670 217 710 222 Q 732 225 725 237 Q 715 250 691 256 Q 669 260 632 251 L 582 240 Q 536 233 493 223 L 448 214 Q 417 210 387 204 Q 371 201 390 186 Q 406 174 438 180 Q 444 181 450 182 L 493 189 Q 536 196 580 203 L 628 210 Z",
                        "M 431 317 Q 432 313 435 310 Q 441 303 448 214 L 450 182 Q 451 169 452 155 Q 455 83 468 62 Q 472 58 478 59 Q 488 65 492 109 Q 492 118 493 189 L 493 223 Q 493 283 497 298 Q 498 311 488 317 Q 478 324 471 327 C 444 341 416 343 431 317 Z",
                        "M 576 52 Q 579 31 584 23 Q 588 17 594 19 Q 601 20 605 33 Q 614 60 628 210 L 632 251 Q 632 266 643 315 Q 647 330 636 338 Q 626 345 617 351 C 592 368 558 372 572 345 L 573 343 Q 574 339 578 334 Q 584 322 582 240 L 580 203 Q 574 83 576 52 Z"
                    ]}
                /> */}
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