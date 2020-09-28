package com.finchina.echart

import androidx.annotation.Keep

@Keep
open class Entry(var name: String, val value: Float, val color: String) {

    constructor(name: String, value: Float) : this(name, value, "#619CFF")
}