# Course-Tools
> 内容工具集

## 注意事项

`页面模版中的加载项需要跟打包项配合。如果打包项忽略某些包，页面模版就需要加载相应的包。`

```webpack.config.base.js
externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
}
```

```index.html
<!-- 加载 React。-->
<!-- 注意: 部署时，将 "development.js" 替换为 "production.min.js"。-->
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```