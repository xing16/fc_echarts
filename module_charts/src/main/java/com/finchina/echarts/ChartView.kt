package com.finchina.echart

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.util.AttributeSet
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import com.finchina.echarts.ChartType
import com.google.gson.Gson
import java.util.*

class ChartView : WebView {

    companion object {
        private val TAG = "ChartView"
    }

    constructor(context: Context) : super(context) {
        init()
    }

    constructor(context: Context, attributeSet: AttributeSet) : super(context, attributeSet) {
        init()
    }

    constructor(context: Context, attributeSet: AttributeSet, defStyle: Int) : super(
            context,
            attributeSet,
            defStyle
    ) {
        init()
    }

    private var isPageFinished = false

    /**
     * 初始化操作
     */
    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    private fun init() {
        // 开启 javascript
        this.settings.javaScriptEnabled = true
        this.settings.databaseEnabled = true
        this.settings.builtInZoomControls = false
        this.settings.blockNetworkImage = false
        this.settings.useWideViewPort = false
        this.settings.setSupportZoom(false)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            setWebContentsDebuggingEnabled(true)
        }

        /**
         * 将当前对象作为 "jsi" 的别名，传递给 js, js 通过 window.jsi.androidMethod()即可调用Android端中的方法 androidMehtod()
         */
        addJavascriptInterface(this, "jsi")
    }


    /**
     * 对外提供设置数据方法
     */
    fun setData(type: ChartType, list: List<Entry>) {
        val map = mutableMapOf<String, Any>()
        map.put("type", type.type)
        map.put("data", list);
        val jsonString = Gson().toJson(map)
        loadLocalFilesAndDrawChart(jsonString)
    }

    private fun loadLocalFilesAndDrawChart(javascriptString: String) {
        if(isPageFinished) {
            val javaScriptStr = "setData('$javascriptString')"
            evaluateJavascriptSafe(javaScriptStr)
        } else {
            this.webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView, url: String) {
                    isPageFinished = true;
                    Log.i(TAG, "图表加载完成!!!!!!!! ");
                    val javaScriptStr = "setData('$javascriptString')"
                    evaluateJavascriptSafe(javaScriptStr)
                }
            }
        }

    }

    /**
     * js 调用 Android 方法，即 js 向 Android 传递参数
     */
    @JavascriptInterface
    fun androidMethod(text: String) {
        Toast.makeText(context, text, Toast.LENGTH_LONG).show()
    }


    /**
     * Android 端调用 js 端方法, 即 Android 向 js 传递参数
     */
    private fun evaluateJavascriptSafe(javascriptString: String) {
        // Android4.4以上调用
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            evaluateJavascript("javascript:$javascriptString") {
                Log.e(TAG, "evaluateJavascript callback: $it")
            }
        } else {
            loadUrl("javascript:$javascriptString")
        }
    }
}