(function(a,d){typeof exports=="object"&&typeof module<"u"?d(exports,require("suidouble"),require("vue")):typeof define=="function"&&define.amd?define(["exports","suidouble","vue"],d):(a=typeof globalThis<"u"?globalThis:a||self,d(a.VueSui={},a.Suidouble,a.Vue))})(this,function(a,d,e){"use strict";var f=document.createElement("style");f.textContent=`.signinwithsui_button[data-v-5933915b]{background:linear-gradient(to bottom,#3898ec 5%,#4ca3ff);border-radius:3px;display:inline-block;cursor:pointer;color:#fff;font-family:Arial;font-size:15px;padding:9px 23px;text-decoration:none;text-shadow:0px 1px 0px #263666;transition:background 1s ease-out;-webkit-user-select:none;user-select:none;margin:0}.signinwithsui_button[data-v-5933915b]:hover{background:linear-gradient(to bottom,#4ca3ff 5%,#3898ec)}.signinwithsui_dialog[data-v-5933915b]{color:#fff;text-shadow:none;top:0;right:0;bottom:0;left:0;z-index:60000;border-radius:0!important;max-width:100vw;max-height:100vh;position:fixed;pointer-events:none!important;display:block}.signinwithsui_dialog_backdrop[data-v-5933915b]{top:0;right:0;bottom:0;left:0;z-index:-1;pointer-events:all;outline:0;background:#0003;position:fixed}.signinwithsui_dialog_inner[data-v-5933915b]{top:0;right:0;left:0;justify-content:center;display:flex;flex-wrap:wrap;padding-top:0!important;padding-bottom:0!important;padding:24px;outline:0;transform:translateY(-100%);transition:transform .3s ease-in-out}.signinwithsui_dialog_inner.signinwithsui_dialog_inner_active[data-v-5933915b]{transform:translateY(0)}.signinwithsui_dialog_inner_card[data-v-5933915b]{background-color:#3898ec99;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);-webkit-tap-highlight-color:transparent;position:relative;vertical-align:top;border-color:#ffffff47;box-shadow:0 1px 5px #fff3,0 2px 2px #ffffff24,0 3px 1px -2px #ffffff1f;pointer-events:all;overflow:auto;-webkit-overflow-scrolling:touch;will-change:scroll-position;border-radius:0 0 4px 4px;width:50%;max-width:560px;max-height:calc(100vh - 48px)}.signinwithsui_dialog_item[data-v-5933915b]{cursor:pointer;outline:0;text-decoration:none;flex-wrap:nowrap;position:relative;display:flex;color:#fff;border-color:#ffffff47;min-height:48px;padding:8px 16px;color:inherit;transition:color .3s,background-color .3s;pointer-events:all;background-color:transparent;-webkit-user-select:none;user-select:none}.signinwithsui_dialog_item_disabled[data-v-5933915b]{opacity:.4}.signinwithsui_dialog_item[data-v-5933915b]:hover{background-color:#0000004d}.signinwithsui_dialog_item_column[data-v-5933915b]{align-items:flex-start;padding-right:16px;width:auto;min-width:0;max-width:100%;display:flex;flex-wrap:wrap;justify-content:center;flex-direction:column;color:inherit}.signinwithsui_dialog_item_icon[data-v-5933915b]{width:42px;height:42px;overflow:hidden}.signinwithsui_dialog_item_name[data-v-5933915b]{height:42px;font-size:16px;padding-left:16px}.signinwithsui_dialog_item_icon img[data-v-5933915b]{width:42px;height:42px}.signinwithsui_button[data-v-b96de773]{background:linear-gradient(to bottom,#3898ec 5%,#4ca3ff);border-radius:3px;display:inline-block;cursor:pointer;color:#fff;font-family:Arial;font-size:15px;padding:9px 23px;text-decoration:none;text-shadow:0px 1px 0px #263666;transition:background 1s ease-out;-webkit-user-select:none;user-select:none;margin:0}.signinwithsui_button[data-v-b96de773]:hover{background:linear-gradient(to bottom,#4ca3ff 5%,#3898ec)}.signinwithsui_dialog[data-v-b96de773]{color:#fff;text-shadow:none;top:0;right:0;bottom:0;left:0;z-index:60000;border-radius:0!important;max-width:100vw;max-height:100vh;position:fixed;pointer-events:none!important;display:block}.signinwithsui_dialog_backdrop[data-v-b96de773]{top:0;right:0;bottom:0;left:0;z-index:-1;pointer-events:all;outline:0;background:#0003;position:fixed}.signinwithsui_dialog_inner[data-v-b96de773]{top:0;right:0;left:0;justify-content:center;display:flex;flex-wrap:wrap;padding-top:0!important;padding-bottom:0!important;padding:24px;outline:0;transform:translateY(-100%);transition:transform .3s ease-in-out}.signinwithsui_dialog_inner.signinwithsui_dialog_inner_active[data-v-b96de773]{transform:translateY(0)}.signinwithsui_dialog_inner_card[data-v-b96de773]{background-color:#3898ec99;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);-webkit-tap-highlight-color:transparent;position:relative;vertical-align:top;border-color:#ffffff47;box-shadow:0 1px 5px #fff3,0 2px 2px #ffffff24,0 3px 1px -2px #ffffff1f;pointer-events:all;overflow:auto;-webkit-overflow-scrolling:touch;will-change:scroll-position;border-radius:0 0 4px 4px;width:50%;max-width:560px;max-height:calc(100vh - 48px)}.signinwithsui_dialog_item[data-v-b96de773]{cursor:pointer;outline:0;text-decoration:none;flex-wrap:nowrap;position:relative;display:flex;color:#fff;border-color:#ffffff47;min-height:48px;padding:8px 16px;color:inherit;transition:color .3s,background-color .3s;pointer-events:all;background-color:transparent;-webkit-user-select:none;user-select:none}.signinwithsui_dialog_item_disabled[data-v-b96de773]{opacity:.4}.signinwithsui_dialog_item[data-v-b96de773]:hover{background-color:#0000004d}.signinwithsui_dialog_item_column[data-v-b96de773]{align-items:flex-start;padding-right:16px;width:auto;min-width:0;max-width:100%;display:flex;flex-wrap:wrap;justify-content:center;flex-direction:column;color:inherit}.signinwithsui_dialog_item_icon[data-v-b96de773]{width:42px;height:42px;overflow:hidden}.signinwithsui_dialog_item_name[data-v-b96de773]{height:42px;font-size:16px;padding-left:16px}.signinwithsui_dialog_item_icon img[data-v-b96de773]{width:42px;height:42px}
`,document.head.appendChild(f);const h=(i,t)=>{const r=i.__vccOpts||i;for(const[l,s]of t)r[l]=s;return r},g={name:"SuiSync",props:{defaultChain:{default:"sui:devnet",type:String}},data(){return{connectedAddress:null,connectedChain:null,adapters:[],suiInBrowser:null,suiMaster:null,lastSuiMasterInstanceN:null}},emits:["connect","connected","loaded","disconnected","error","suiMaster","adapters"],components:{},watch:{},methods:{async reinitSueMaster(){this.suiMaster=await this.suiInBrowser.getSuiMaster(),(!this.lastSuiMasterInstanceN||this.lastSuiMasterInstanceN!=this.suiMaster.instanceN)&&this.$emit("suiMaster",this.suiMaster)}},mounted:function(){this.suiInBrowser=d.SuiInBrowser.getSingleton({debug:!0,defaultChain:this.defaultChain}),console.log("mounted",this.suiInBrowser._defaultChain),this.adapters=Object.values(this.suiInBrowser.adapters),this.suiInBrowser.addEventListener("adapter",i=>{this.adapters.push(i.detail),console.log(i.detail),this.$emit("adapters",this.adapters)}),this.suiInBrowser.addEventListener("connected",()=>{this.connectedAddress=this.suiInBrowser.connectedAddress,this.connectedChain=this.suiInBrowser.connectedChain,this.reinitSueMaster(),this.$emit("connected",this.suiInBrowser)}),this.suiInBrowser.addEventListener("disconnected",()=>{this.connectedAddress=null,this.connectedChain=null,this.$emit("disconnected")}),this.$nextTick(()=>{this.$emit("loaded",this.suiInBrowser),this.$emit("adapters",this.adapters)}),this.suiInBrowser.isConnected&&(this.connectedAddress=this.suiInBrowser.connectedAddress,this.connectedChain=this.suiInBrowser.connectedChain,this.reinitSueMaster(),this.$emit("connected",this.suiInBrowser)),this.reinitSueMaster()},computed:{}};function m(i,t,r,l,s,n){return e.openBlock(),e.createElementBlock("div")}const _=h(g,[["render",m]]),w={name:"SignInWithSuiDialog",emits:["click","hidden"],props:{adapters:{type:Array,default(){return[]}},showing:{type:Boolean,default:!1}},data(){return{isActive:!1,isVisible:!1}},watch:{showing:function(){this.showing?this.show():this.hide()}},computed:{},components:{},methods:{onAdapterClick(i){this.$emit("click",i)},show(){this.isActive=!0,setTimeout(()=>{this.isVisible=!0},10)},hide(){this.isVisible=!1,setTimeout(()=>{this.isActive=!1,this.$emit("hidden")},300)},onBackdrop(){this.hide()}},beforeMount:function(){},mounted:async function(){}},b={key:0,class:"signinwithsui_dialog"},x={class:"signinwithsui_dialog_inner_card"},k={class:"signinwithsui_dialog_list"},S=["onClick"],C={class:"signinwithsui_dialog_item_column signinwithsui_dialog_item_icon"},M=["src"],v={class:"signinwithsui_dialog_item_column signinwithsui_dialog_item_name"};function y(i,t,r,l,s,n){return s.isActive?(e.openBlock(),e.createElementBlock("div",b,[e.createElementVNode("div",{class:"signinwithsui_dialog_backdrop",onClick:t[0]||(t[0]=(...o)=>n.onBackdrop&&n.onBackdrop(...o))}),e.createElementVNode("div",{class:e.normalizeClass(["signinwithsui_dialog_inner",{signinwithsui_dialog_inner_active:s.isVisible}])},[e.createElementVNode("div",x,[e.createElementVNode("div",k,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(r.adapters,(o,c)=>(e.openBlock(),e.createElementBlock(e.Fragment,{key:c},[o.isDefault||o.okForSui?(e.openBlock(),e.createElementBlock("div",{key:0,class:e.normalizeClass(["signinwithsui_dialog_item",{signinwithsui_dialog_item_disabled:o.isDefault}]),onClick:u=>n.onAdapterClick(o)},[e.createElementVNode("div",C,[e.createElementVNode("img",{loading:"lazy",fetchpriority:"auto","aria-hidden":"true",draggable:"false",src:o.icon},null,8,M)]),e.createElementVNode("div",v,e.toDisplayString(o.name),1)],10,S)):e.createCommentVNode("",!0)],64))),128))])])],2)])):e.createCommentVNode("",!0)}const B={name:"SignInWithSui",emits:["suiMaster","provider","client","adapter","disconnected","connected","wrongchain"],props:{defaultChain:{default:"sui:devnet",type:String},auto:{default:!1,type:Boolean},visible:{default:!0,type:Boolean}},data(){return{isLoading:!1,libsRequested:!0,adapters:[],connectedAddress:null,connectedChain:null,forceChainCalculated:null,suiMaster:null,showingDialog:!1}},watch:{defaultChain:async function(){this.connectedAddress=null,this.connectedChain=null,this.suiMaster=null,console.error("switched"),this.libsRequested=!1,await new Promise(i=>setTimeout(i,50)),this.libsRequested=!0}},computed:{displayAddress(){return(""+this.connectedAddress).substr(0,6)+"..."+(""+this.connectedAddress).substr(-4)}},components:{SuidoubleSync:_,SignInWithSuiDialog:h(w,[["render",y],["__scopeId","data-v-5933915b"]])},methods:{onSuiMaster(i){this.suiMaster=i,(!this.defaultChain||this.defaultChain==this.suiMaster.connectedChain)&&(this.$emit("suiMaster",i),i.getClient().then(t=>{this.$emit("client",t),this.$emit("provider",t),i.signer&&i.signer.activeAdapter&&this.$emit("adapter",i.signer.activeAdapter)})),this.__suiMasterPromise&&this.suiMaster&&(this.__suiMasterPromiseResolver(),this.__suiMasterPromise=null),this.__connectedSuiMasterPromise&&this.isSuiMasterConnected()&&(this.__connectedSuiMasterPromiseResolver(),this.__connectedSuiMasterPromise=null)},onSuiAdapters(i){this.adapters=i},isSuiMasterConnected(i=null){return this.suiMaster&&this.suiMaster.address?!(i&&this.suiMaster.connectedChain!=i):this.suiMaster&&this.suiMaster.signer&&this.suiMaster.signer.connectedAddress?!(i&&this.suiMaster.signer.connectedChain!=i):!1},async onAdapterClick(i){if(this.showingDialog=!1,i.isDefault&&!i.isInstalled)return window.open(i.getDownloadURL(),"_blank"),!1;this.isLoading=!0,await this.$refs.sui.suiInBrowser.connect(i),this.isLoading=!1},async requestSuiMaster(){if(this.suiMaster)return this.suiMaster;if(await this.requestLibs(),await new Promise(i=>{setTimeout(i,200)}),this.suiMaster)return this.suiMaster;if(this.__suiMasterPromise){if(await this.__suiMasterPromise,this.suiMaster)return this.suiMaster;throw new Error("can not get suiMaster")}if(this.__suiMasterPromiseResolver=null,this.__suiMasterPromise=new Promise(i=>{this.__suiMasterPromiseResolver=i}),await this.__suiMasterPromise,this.suiMaster)return this.suiMaster;throw new Error("can not get suiMaster")},async requestConnectedSuiMaster(i=null){if(this.isSuiMasterConnected(i))return this.suiMaster;if(await this.requestLibs(),await new Promise(t=>{setTimeout(t,200)}),this.isSuiMasterConnected(i))return this.suiMaster;if(this.isLoading=!0,this.__connectedSuiMasterPromise){if(await this.__connectedSuiMasterPromise,this.isLoading=!1,this.isSuiMasterConnected(i))return this.suiMaster;throw new Error("can not get connection")}if(this.__connectedSuiMasterPromiseResolver=null,this.__connectedSuiMasterPromise=new Promise(t=>{this.__connectedSuiMasterPromiseResolver=t}),this.showingDialog=!0,await this.__connectedSuiMasterPromise,this.isLoading=!1,this.isSuiMasterConnected(i))return this.suiMaster;throw new Error("can not get connection")},async onClick(){this.isLoading=!0,await this.requestLibs(),await new Promise(i=>{setTimeout(i,200)}),this.connectedAddress||(this.showingDialog=!0),this.isLoading=!1},async initialize(){this.auto&&(this.isLoading=!0,await this.requestLibs(),this.isLoading=!1)},async requestLibs(){this.libsRequested=!0,await this.__libsRequestedPromise},onLibsLoaded(){this.__libsRequestedPromiseResolver()},onConnected(){this.showingDialog=!1;const i=this.$refs.sui.suiInBrowser.connectedChain;!this.defaultChain||this.defaultChain==i?(this.connectedAddress=this.$refs.sui.suiInBrowser.connectedAddress,this.connectedChain=this.$refs.sui.suiInBrowser.connectedChain,this.$emit("connected",this.connectedAddress)):(this.connectedAddress=null,this.$emit("wrongchain",i))},onDisconnected(){this.connectedAddress=null,this.$emit("disconnected")}},beforeMount:function(){this.__libsRequestedPromiseResolver=null,this.__libsRequestedPromise=new Promise(i=>{this.__libsRequestedPromiseResolver=i})},mounted:async function(){this.initialize()}},A={key:0},I={key:1};function P(i,t,r,l,s,n){const o=e.resolveComponent("SignInWithSuiDialog"),c=e.resolveComponent("SuidoubleSync");return e.openBlock(),e.createElementBlock("div",null,[r.visible?(e.openBlock(),e.createElementBlock("div",{key:0,onClick:t[0]||(t[0]=(...u)=>n.onClick&&n.onClick(...u))},[s.connectedAddress?e.createCommentVNode("",!0):(e.openBlock(),e.createElementBlock("span",A,"Connect with Sui")),s.connectedAddress?(e.openBlock(),e.createElementBlock("span",I,"Connected as "+e.toDisplayString(n.displayAddress)+" ("+e.toDisplayString(s.connectedChain)+")",1)):e.createCommentVNode("",!0)])):e.createCommentVNode("",!0),e.createVNode(o,{showing:s.showingDialog,onHidden:t[1]||(t[1]=u=>{this.showingDialog=!1}),adapters:s.adapters,onClick:n.onAdapterClick},null,8,["showing","adapters","onClick"]),s.libsRequested?(e.openBlock(),e.createBlock(c,{key:1,ref:"sui",defaultChain:r.defaultChain,onAdapters:n.onSuiAdapters,onSuiMaster:n.onSuiMaster,onLoaded:n.onLibsLoaded,onConnected:n.onConnected,onDisconnected:n.onDisconnected},null,8,["defaultChain","onAdapters","onSuiMaster","onLoaded","onConnected","onDisconnected"])):e.createCommentVNode("",!0)])}const p=h(B,[["render",P]]),$={name:"SignInWithSuiButton",emits:["suiMaster","provider","client","adapter","disconnected","connected","wrongchain"],props:{defaultChain:{default:"sui:devnet",type:String}},components:{SignInWithSui:p},data(){return{connectedAddress:null,connectedChain:null}},methods:{onConnected(i){this.connectedAddress=i,this.$emit("connected",i)},onWrongChain(i){this.$emit("wrongchain",i)},onSuiMaster(i){this.$emit("suiMaster",i)},onProvider(i){this.$emit("client",i),this.$emit("provider",i)},onAdapter(i){this.$emit("adapter",i)}}};function L(i,t,r,l,s,n){const o=e.resolveComponent("SignInWithSui");return e.openBlock(),e.createElementBlock("div",{class:"signinwithsui_button",onClick:t[1]||(t[1]=c=>{this.$refs.signin.onClick()})},[e.createVNode(o,{defaultChain:r.defaultChain,ref:"signin",onProvider:n.onProvider,onOnAdapter:n.onAdapter,onWrongchain:n.onWrongChain,onConnected:n.onConnected,onDisconnected:t[0]||(t[0]=c=>this.$emit("disconnected")),onSuiMaster:n.onSuiMaster},null,8,["defaultChain","onProvider","onOnAdapter","onWrongchain","onConnected","onSuiMaster"])])}const E=h($,[["render",L],["__scopeId","data-v-b96de773"]]);a.SignInWithSui=p,a.SignInWithSuiButton=E,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});
