import { Spin } from 'antd';
import './index.module.less';

export default ({ pinyin = '', strokes = [], spinning = false }) => {
    return (
        <Spin spinning={spinning} size="large" tip="正在生成动画包，请稍后...">
            <div id="tianzige_thumb_container" className="container" style={style}>
                <div className="pinyin-box">
                    <div className="pinyin">{pinyin}</div>
                </div>
                <div className="stroke-box">
                    <div className="stroke">
                        <svg width="3.98rem" height="3.98rem">
                            <g transform="translate(15, 330) scale(0.35, -0.35)">
                                {strokes && strokes.map(d => <path d={d} className="storke-path" />)}
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </Spin>
    );
};