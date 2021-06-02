import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var index = memoize(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

const cx = function cx() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
};

/**
 * This file contains an runtime version of `styled` component. Responsibilities of the component are:
 * - returns ReactElement based on HTML tag used with `styled` or custom React Component
 * - injects classNames for the returned component
 * - injects CSS variables used to define dynamic styles based on props
 */

// Workaround for rest operator
const restOp = (obj, keysToExclude) => Object.keys(obj).filter(prop => keysToExclude.indexOf(prop) === -1).reduce((acc, curr) => {
  acc[curr] = obj[curr];
  return acc;
}, {}); // rest operator workaround


const warnIfInvalid = (value, componentName) => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof value === 'string' || // eslint-disable-next-line no-self-compare
    typeof value === 'number' && isFinite(value)) {
      return;
    }

    const stringified = typeof value === 'object' ? JSON.stringify(value) : String(value); // eslint-disable-next-line no-console

    console.warn(`An interpolation evaluated to '${stringified}' in the component '${componentName}', which is probably a mistake. You should explicitly cast or transform the value to a string.`);
  }
};

function styled(tag) {
  return options => {
    if (process.env.NODE_ENV !== 'production') {
      if (Array.isArray(options)) {
        // We received a strings array since it's used as a tag
        throw new Error('Using the "styled" tag in runtime is not supported. Make sure you have set up the Babel plugin correctly. See https://github.com/callstack/linaria#setup');
      }
    }

    const render = (props, ref) => {
      const {
        as: component = tag,
        class: className
      } = props;
      const rest = restOp(props, ['as', 'class']);
      let filteredProps; // Check if it's an HTML tag and not a custom element

      if (typeof component === 'string' && component.indexOf('-') === -1) {
        filteredProps = {}; // eslint-disable-next-line guard-for-in

        for (const key in rest) {
          if (key === 'as' || index(key)) {
            // Don't pass through invalid attributes to HTML elements
            filteredProps[key] = rest[key];
          }
        }
      } else {
        filteredProps = rest;
      }

      filteredProps.ref = ref;
      filteredProps.className = cx(filteredProps.className || className, options.class);
      const {
        vars
      } = options;

      if (vars) {
        const style = {}; // eslint-disable-next-line guard-for-in

        for (const name in vars) {
          const variable = vars[name];
          const result = variable[0];
          const unit = variable[1] || '';
          const value = typeof result === 'function' ? result(props) : result;
          warnIfInvalid(value, options.name);
          style[`--${name}`] = `${value}${unit}`;
        }

        const ownStyle = filteredProps.style || {};
        const keys = Object.keys(ownStyle);

        if (keys.length > 0) {
          keys.forEach(key => {
            style[key] = ownStyle[key];
          });
        }

        filteredProps.style = style;
      }

      if (tag.__linaria && tag !== component) {
        // If the underlying tag is a styled component, forward the `as` prop
        // Otherwise the styles from the underlying component will be ignored
        filteredProps.as = component;
        return /*#__PURE__*/React.createElement(tag, filteredProps);
      }

      return /*#__PURE__*/React.createElement(component, filteredProps);
    };

    const Result = React.forwardRef ? /*#__PURE__*/React.forwardRef(render) : // React.forwardRef won't available on older React versions and in Preact
    // Fallback to a innerRef prop in that case
    props => {
      const rest = restOp(props, ['innerRef']);
      return render(rest, props.innerRef);
    };
    Result.displayName = options.name; // These properties will be read by the babel plugin for interpolation

    Result.__linaria = {
      className: options.class,
      extends: tag
    };
    return Result;
  };
}

var styled$1 = process.env.NODE_ENV !== 'production' ? new Proxy(styled, {
  get(o, prop) {
    return o(prop);
  }

}) : styled;

const Container = /*#__PURE__*/styled$1("div")({
  name: "Container",
  class: "cew27ew",
  vars: {
    "cew27ew-0": [p => p.actualHeight, "px"],
    "cew27ew-1": [p => p.centerSpinner ? 'center' : 'flex-start'],
    "cew27ew-2": [p => p.shouldReset ? `height ${p.resetDuration}ms ${p.resetEase}` : 'none']
  }
});
const Spinner = /*#__PURE__*/styled$1("div")({
  name: "Spinner",
  class: "s1b2ugnh",
  vars: {
    "s1b2ugnh-0": [p => p.fadeSpinner ? p.pctPulled : 1],
    "s1b2ugnh-1": [p => p.shouldReset ? `translateY(${p.pctPulled * (p.spinnerSize + p.spinnerOffset) - p.spinnerSize}px) rotate(${p.rotateSpinner && p.shouldSpin ? 90 : 0}deg)` : `translateY(${p.pctPulled * (p.spinnerSize + p.spinnerOffset) - p.spinnerSize}px) rotate(${p.rotateSpinner ? p.pctPulled * 90 : 0}deg)`],
    "s1b2ugnh-2": [p => p.shouldReset ? `opacity ${p.resetDuration}ms ${p.resetEase}, transform ${p.resetDuration}ms ${p.resetEase}` : 'none']
  }
});
const SpinnerSVG = /*#__PURE__*/styled$1("svg")({
  name: "SpinnerSVG",
  class: "shsfp3r",
  vars: {
    "shsfp3r-0": [p => p.spinnerSize, "px"],
    "shsfp3r-2": [p => p.spinnerColor],
    "shsfp3r-3": [p => p.shouldSpin ? `scale ${p.popDuration}ms cubic-bezier(0.55, 0.055, 0.675, 0.19), rotate360 ${p.spinSpeed}ms linear ${p.popDuration}ms infinite` : 'none']
  }
});

const Pullable = ({
  className,
  children,
  onRefresh,
  centerSpinner = true,
  fadeSpinner = true,
  rotateSpinner = true,
  spinnerSize = 24,
  spinnerOffset = 0,
  spinnerColor = '#000000',
  spinSpeed = 1200,
  popDuration = 200,
  distThreshold = 72,
  resistance = 2.5,
  refreshDuration = 1000,
  resetDuration = 400,
  resetEase = 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  shouldPullToRefresh = () => window.scrollY <= 0,
  disabled = false
}) => {
  const [status, setStatus] = useState('ready');
  const [height, setHeight] = useState(0);
  const pullStartY = useRef();
  const dist = useRef(0);
  const distResisted = useRef(0);
  const [ignoreTouches, setIgnoreTouches] = useState(false);
  const resetTimeout = useRef();
  const refreshCompletedTimeout = useRef();
  const reset = useCallback((delay = 0) => {
    resetTimeout.current = window.setTimeout(() => {
      pullStartY.current = undefined;
      dist.current = 0;
      distResisted.current = 0;
      setIgnoreTouches(false);
      setStatus('ready');
    }, delay);
  }, []);
  const refresh = useCallback(() => {
    setIgnoreTouches(true);
    setStatus('refreshing');
    onRefresh?.();
    refreshCompletedTimeout.current = window.setTimeout(() => {
      setStatus('refreshCompleted');
      setHeight(0);
      reset(resetDuration);
    }, refreshDuration);
  }, [onRefresh, refreshDuration, reset, resetDuration]);
  const onTouchStart = useCallback(touchEvent => {
    if (disabled || ignoreTouches) return;
    pullStartY.current = status === 'ready' && shouldPullToRefresh() ? touchEvent.touches[0].screenY : undefined;
  }, [disabled, ignoreTouches, shouldPullToRefresh, status]);
  const onTouchMove = useCallback(touchEvent => {
    if (disabled || ignoreTouches || pullStartY.current === undefined) return;
    const movedY = touchEvent.touches[0].screenY; // setPullMoveY(movedY);

    dist.current = movedY - (pullStartY.current || 0);

    if (dist.current > 0) {
      touchEvent.preventDefault();
      const minDist = Math.min(dist.current / resistance, distThreshold);
      setStatus('pulling');
      setHeight(minDist);

      if (minDist === distThreshold) {
        refresh();
      }
    }
  }, [disabled, dist, distThreshold, ignoreTouches, refresh, resistance]);
  const onTouchEnd = useCallback(() => {
    if (disabled || ignoreTouches) return;

    if (status === 'pulling') {
      setIgnoreTouches(true);
      setStatus('pullAborted');
      setHeight(0);
      reset(resetDuration);
    } else {
      reset();
    }
  }, [disabled, ignoreTouches, reset, resetDuration, status]);
  useEffect(() => {
    window.addEventListener('touchstart', onTouchStart);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, [onTouchStart]);
  useEffect(() => {
    window.addEventListener('touchmove', onTouchMove, {
      passive: false
    });
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [onTouchMove]);
  useEffect(() => {
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchEnd]);
  useEffect(() => {
    return () => {
      window.clearTimeout(refreshCompletedTimeout.current);
      window.clearTimeout(resetTimeout.current);
    };
  }, []);
  const shouldSpin = status === 'refreshing' || status === 'refreshCompleted';
  const shouldReset = status === 'pullAborted' || status === 'refreshCompleted';
  const pctPulled = height / distThreshold;
  return jsxs(Fragment, {
    children: [jsx(Container, Object.assign({
      className: className,
      actualHeight: height,
      centerSpinner: centerSpinner,
      resetDuration: resetDuration,
      resetEase: resetEase,
      shouldReset: shouldReset
    }, {
      children: jsx(Spinner, Object.assign({
        pctPulled: pctPulled,
        fadeSpinner: fadeSpinner,
        rotateSpinner: rotateSpinner,
        spinnerSize: spinnerSize,
        spinnerOffset: spinnerOffset,
        resetDuration: resetDuration,
        resetEase: resetEase,
        shouldReset: shouldReset,
        shouldSpin: shouldSpin
      }, {
        children: jsxs(SpinnerSVG, Object.assign({
          viewBox: "0 0 24 24",
          fill: "none",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          spinnerSize: spinnerSize,
          spinnerColor: spinnerColor,
          popDuration: popDuration,
          spinSpeed: spinSpeed,
          shouldSpin: shouldSpin
        }, {
          children: [jsx("line", {
            x1: "12",
            y1: "2",
            x2: "12",
            y2: "6"
          }, void 0), jsx("line", {
            x1: "12",
            y1: "18",
            x2: "12",
            y2: "22"
          }, void 0), jsx("line", {
            x1: "4.93",
            y1: "4.93",
            x2: "7.76",
            y2: "7.76"
          }, void 0), jsx("line", {
            x1: "16.24",
            y1: "16.24",
            x2: "19.07",
            y2: "19.07"
          }, void 0), jsx("line", {
            x1: "2",
            y1: "12",
            x2: "6",
            y2: "12"
          }, void 0), jsx("line", {
            x1: "18",
            y1: "12",
            x2: "22",
            y2: "12"
          }, void 0), jsx("line", {
            x1: "4.93",
            y1: "19.07",
            x2: "7.76",
            y2: "16.24"
          }, void 0), jsx("line", {
            x1: "16.24",
            y1: "7.76",
            x2: "19.07",
            y2: "4.93"
          }, void 0)]
        }), void 0)
      }), void 0)
    }), void 0), children]
  }, void 0);
};

export { Pullable };
//# sourceMappingURL=index.mjs.map
