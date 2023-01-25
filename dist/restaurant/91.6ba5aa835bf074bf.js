"use strict";(self.webpackChunkRestaurant=self.webpackChunkRestaurant||[]).push([[91],{7091:(ae,R,u)=>{u.r(R),u.d(R,{PaymentModule:()=>ie});var w=u(9808),p=u(9826),e=u(5e3),T=u(9118);let U=(()=>{class i{constructor(t){this.mainService=t}canActivate(){return this.mainService.getshowPaymentStatus()}}return i.\u0275fac=function(t){return new(t||i)(e.LFG(T.J))},i.\u0275prov=e.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();var E=u(5861),m=u(4987),k=u(9397),g=u(3075),I=u(158),_=u(8966),F=u(1584),O=u(8814),P=u(6444);let N=(()=>{class i{constructor(t,o,a,r,d){this.mainService=t,this.router=o,this.route=a,this.restaturantService=r,this.dialog=d,this.total=0,this.currencySymbol="",this.currencySymbol=t.getToLocalStorage(m.g.LOCAL_USER).currencySymbol||"\u20b9"}ngOnInit(){var t,o;this.cartItems=this.mainService.getToLocalStorage(m.g.LOCAL_CART),this.cartItems?this.total=this.restaturantService.calculateTotal(this.cartItems):null===(o=null===(t=this.route)||void 0===t?void 0:t.parent)||void 0===o||o.params.subscribe(a=>{a&&a.name?this.router.navigate(["/restaurant",a.name,"cart"]):this.mainService.openDialog("Error","Invalid Url","E")})}openDialog(t,o,a){this.dialog.open(k.u,{data:{message:o,type:a,heading:t},panelClass:"popUp-modalbox"})}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(T.J),e.Y36(p.F0),e.Y36(p.gz),e.Y36(P.T),e.Y36(_.uw))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-data"]],decls:18,vars:5,consts:[[1,"rounded-md","border","border-gray-200","py-6","px-4","dark:border-gray-800"],[1,"font-semibold","text-sm","mb-4","dark:text-white"],[1,"flex","justify-between","text-base","text-gray-700"],[1,"dark:text-gray-400"],[1,"text-red-500","dark:text-red-700"],[1,"flex","mt-2","pb-4","justify-between","text-base","text-gray-700"],[1,"border-t","border-gray-200","flex","pt-4","justify-between","text-base","text-gray-700","dark:border-gray-800"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0)(1,"h1",1),e._uU(2,"Order Summary"),e.qZA(),e.TgZ(3,"div",2)(4,"p",3),e._uU(5,"Subtotal"),e.qZA(),e.TgZ(6,"p",4),e._uU(7),e.qZA()(),e.TgZ(8,"div",5)(9,"p",3),e._uU(10,"Fee"),e.qZA(),e.TgZ(11,"p",4),e._uU(12),e.qZA()(),e.TgZ(13,"div",6)(14,"p",3),e._uU(15,"Total"),e.qZA(),e.TgZ(16,"p",4),e._uU(17),e.qZA()()()),2&t&&(e.xp6(7),e.AsE("",o.currencySymbol,"",o.total,""),e.xp6(5),e.hij("",o.currencySymbol,"0"),e.xp6(5),e.AsE("",o.currencySymbol,"",o.total,""))},styles:[""]}),i})();var Y=u(4270),Z=u(508);function D(i,n){1&i&&e._UZ(0,"app-loader")}function z(i,n){if(1&i&&(e.TgZ(0,"option",16),e._uU(1),e.qZA()),2&i){const t=n.$implicit;e.Q6J("value",null==t?null:t.name),e.xp6(1),e.hij(" ",null==t?null:t.name,"")}}function J(i,n){1&i&&(e.TgZ(0,"div",17),e._uU(1," Invalid table number "),e.qZA())}function j(i,n){1&i&&(e.TgZ(0,"div",18),e._UZ(1,"app-login"),e.qZA())}function G(i,n){if(1&i){const t=e.EpF();e.TgZ(0,"div",19)(1,"button",20),e.NdJ("click",function(){return e.CHM(t),e.oxw().createOrderAndRazorpay("offline")}),e._uU(2," Pay On Desk "),e.qZA(),e.TgZ(3,"button",21),e.NdJ("click",function(){return e.CHM(t),e.oxw().createOrderAndRazorpay("online")}),e._uU(4," Pay Now "),e.qZA()()}if(2&i){const t=e.oxw();e.xp6(1),e.Q6J("disabled",t.isLoading)("matRippleCentered",!1)("matRippleDisabled",!1)("matRippleUnbounded",!1),e.xp6(2),e.Q6J("disabled",t.isLoading)("matRippleCentered",!1)("matRippleDisabled",!1)("matRippleUnbounded",!1)}}function q(i,n){1&i&&(e.TgZ(0,"div",22),e._uU(1," You're not logged in, enter email & mobile to login, and proceed to pay"),e.qZA())}function M(i,n){1&i&&(e.TgZ(0,"div",22),e._uU(1," Table number is incorrect, table number is important for order"),e.qZA())}const Q=function(i,n){return{" border-2 border-red-500":i,"border-gray-300":n}};let B=(()=>{class i{constructor(t,o,a,r,d,c,v,s){this.formBuilder=t,this.paymentService=o,this.mainService=a,this.dialog=r,this.userService=d,this.router=c,this.route=v,this.zone=s,this.isLogin=!1,this.isLoading=!0,this.jwt="",this.slug="",this.tables=[],this.tableFormGroup=this.formBuilder.group({tableNumber:["",[g.kI.required,g.kI.nullValidator]]});const l=this.mainService.getToLocalStorage(m.g.LOCAL_USER);this.jwt=l.jwt||"",this.mainService.getToLocalStorage(m.g.LOCAL_CART)}ngOnInit(){var t=this;return(0,E.Z)(function*(){var o,a;t.jwt?t.userService.checkLoggedIn(t.jwt).then(r=>{t.isLoading=!1,t.isLogin=!0}).catch(r=>{var d,c,v,s,l,f,b,h;t.mainService.openDialog("Login Error",r&&(null==r?void 0:r.response)&&(null==r?void 0:r.response)&&(null===(c=null===(d=null==r?void 0:r.response)||void 0===d?void 0:d.data)||void 0===c?void 0:c.error)?(null===(l=null===(s=null===(v=null==r?void 0:r.response)||void 0===v?void 0:v.data)||void 0===s?void 0:s.error)||void 0===l?void 0:l.status)+": "+(null===(h=null===(b=null===(f=null==r?void 0:r.response)||void 0===f?void 0:f.data)||void 0===b?void 0:b.error)||void 0===h?void 0:h.message):"Something went wrong, check your network and try again.","E"),console.log("User Login Error",r)}):t.isLoading=!1,null===(a=null===(o=t.route)||void 0===o?void 0:o.parent)||void 0===a||a.params.subscribe(r=>{r&&r.name&&(t.slug=r.name,t.route.queryParams.subscribe(d=>{t.getAllTables(r.name,d.tb)}))})})()}loadScript(t){return new Promise(o=>{const a=document.createElement("script");a.src=t,a.onload=()=>{o(!0)},a.onerror=()=>{o(!1)},document.body.appendChild(a)})}createOrderAndRazorpay(t){var o=this;return(0,E.Z)(function*(){var a,r,d,c;if("online"==t){if(o.isLoading=!0,!(yield o.loadScript(m.g.RAZORPAY_SCRIPT_URL)))return o.isLoading=!1,console.error("Razorpay SDK failed to load. Are you online?"),void o.mainService.openDialog("Payment Service Error","Payment service failed to load. Are you online?","E");null===(r=null===(a=o.route)||void 0===a?void 0:a.parent)||void 0===r||r.params.subscribe(s=>{s&&s.name&&o.paymentService.createOrder(o.paymentService.getOrderInfo(s.name||""),o.tableFormGroup.value.tableNumber,t).then(l=>o.launchRazorPay(l.data)).catch(l=>{var f,b,h,y,x,S,C,L;o.isLoading=!1,console.log("Error while creating order",l),o.mainService.openDialog("Create Order Error",l&&(null==l?void 0:l.response)&&(null==l?void 0:l.response)&&(null===(b=null===(f=null==l?void 0:l.response)||void 0===f?void 0:f.data)||void 0===b?void 0:b.error)?(null===(x=null===(y=null===(h=null==l?void 0:l.response)||void 0===h?void 0:h.data)||void 0===y?void 0:y.error)||void 0===x?void 0:x.status)+": "+(null===(L=null===(C=null===(S=null==l?void 0:l.response)||void 0===S?void 0:S.data)||void 0===C?void 0:C.error)||void 0===L?void 0:L.message):"Something went wrong, check your network and try again.","E")})})}else"offline"==t&&(o.isLoading=!0,null===(c=null===(d=o.route)||void 0===d?void 0:d.parent)||void 0===c||c.params.subscribe(v=>{v&&v.name&&o.paymentService.createOrder(o.paymentService.getOrderInfo(v.name||""),o.tableFormGroup.value.tableNumber,t).then(s=>{o.isLoading=!1,o.mainService.setshowPaymentStatus(!0),localStorage.setItem(m.g.LOCAL_CART,""),o.zone.run(()=>o.router.navigate(["payment",o.slug,m.g.SUCCESS],{queryParams:{tb:o.tableFormGroup.value.tableNumber,message:"Order placed, preparing your order, kindly make your payment on desk"}}))}).catch(s=>{var l,f,b,h,y,x,S,C;o.isLoading=!1,console.log("Error while creating order",s),o.mainService.openDialog("Create Order Error",s&&(null==s?void 0:s.response)&&(null==s?void 0:s.response)&&(null===(f=null===(l=null==s?void 0:s.response)||void 0===l?void 0:l.data)||void 0===f?void 0:f.error)?(null===(y=null===(h=null===(b=null==s?void 0:s.response)||void 0===b?void 0:b.data)||void 0===h?void 0:h.error)||void 0===y?void 0:y.status)+": "+(null===(C=null===(S=null===(x=null==s?void 0:s.response)||void 0===x?void 0:x.data)||void 0===S?void 0:S.error)||void 0===C?void 0:C.message):"Something went wrong, check your network and try again.","E")})}))})()}launchRazorPay(t){this.mainService.setshowPaymentStatus(!0);const o={key:t.razorpayKeyId,currency:t.currency,amount:t.amountBaseUnit,order_id:t.razorpayOrderId,notes:{id:t.id},name:"Paying to "+this.slug.split("-").join(" ").toUpperCase(),description:m.g.PAYMENT_DESCRIPTION,image:"../../../favicon.ico",handler:d=>this.zone.run(()=>{if(d.razorpay_payment_id&&d.razorpay_order_id&&d.razorpay_signature)try{localStorage.setItem(m.g.LOCAL_CART,""),this.router.navigate(["payment",this.slug,m.g.SUCCESS],{queryParams:{tb:this.tableFormGroup.value.tableNumber,message:"Payment Received, preparing your order"}})}catch(c){this.isLoading=!1,console.log(c),this.mainService.openDialog("Some Error Occured",c.message||"Something went wrong, try again later","E")}}),prefill:{name:this.mainService.getToLocalStorage(m.g.LOCAL_USER).fullName,email:this.mainService.getToLocalStorage(m.g.LOCAL_USER).email,contact:this.mainService.getToLocalStorage(m.g.LOCAL_USER).number},theme:{color:"#3f51b5"},modal:{ondismiss:()=>this.zone.run(()=>{this.isLoading=!1})}},r=new window.Razorpay(o);r.on("payment.failed",d=>this.zone.run(()=>{try{this.router.navigate(["payment",this.slug,m.g.FAILED],{queryParams:{tb:this.tableFormGroup.value.tableNumber}})}catch(c){this.isLoading=!1,console.log(c),this.mainService.openDialog("Some Error Occured",c.message||"Something went wrong, try again later","E")}})),r.open()}getAllTables(t,o){this.isLoading=!0,this.paymentService.getAllTables(t).then(a=>{var r,d;this.tables=a.data;const c=null===(d=null===(r=this.tables)||void 0===r?void 0:r.filter(v=>v.slug==o)[0])||void 0===d?void 0:d.name;this.tableFormGroup.controls.tableNumber.patchValue(c),this.isLoading=!1}).catch(a=>{this.isLoading=!1,console.log("Error",a),this.mainService.openDialog("Error",this.mainService.errorMessage(a),"E")})}checkTableError(){var t;return null===(t=this.tableFormGroup.get("tableNumber"))||void 0===t?void 0:t.errors}openDialog(t,o,a){this.dialog.open(k.u,{data:{message:o,type:a,heading:t},panelClass:"popUp-modalbox"}),this.isLoading=!1}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(g.qu),e.Y36(I.t),e.Y36(T.J),e.Y36(_.uw),e.Y36(F.K),e.Y36(p.F0),e.Y36(p.gz),e.Y36(e.R0b))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-checkout"]],decls:19,vars:12,consts:[[4,"ngIf"],[1,"w-full","dark:bg-gray-900"],[1,"pb-36","pt-8","px-4","mx-auto","max-w-md","md:mx-auto","dark:bg-gray-900"],[1,"space-y-6",3,"formGroup"],[1,"mt-4"],[1,"dark:text-gray-400","text-sm"],["name","table","autocomplete","none","formControlName","tableNumber",1,"mt-2","dark:bg-slate-700","dark:placeholder:text-gray-400","dark:text-white","dark:ring-slate-600","dark:border-gray-500","appearance-none","relative","block","w-full","px-3","py-2","border","border-gray-300","placeholder-gray-500","text-gray-900","rounded-md","focus:outline-none","focus:ring-indigo-500","focus:border-indigo-500","focus:z-10","sm:text-sm",3,"ngClass"],[3,"value",4,"ngFor","ngForOf"],["class","text-red-500 text-xs mt-2",4,"ngIf"],[1,"text-gray-400","mt-2","text-xs"],["class","mt-8 border-t border-gray-200",4,"ngIf"],["id","bottom-navigation",1,"block","dark:bg-gray-800","bg-gray-50","fixed","inset-x-0","-bottom-1","z-10","shadow-md",2,"box-shadow","0px -2px 10px 0px #00000017"],["id","tabs",1,"flex","justify-between","items-center","mx-auto","max-w-md","align-middle","px-4","space-x-4","py-4"],["class","flex justify-between items-center align-middle w-full",4,"ngIf"],["class","flex text-sm justify-center text-center w-full  text-red-600",4,"ngIf"],["class","flex text-sm justify-center text-center w-full text-red-600",4,"ngIf"],[3,"value"],[1,"text-red-500","text-xs","mt-2"],[1,"mt-8","border-t","border-gray-200"],[1,"flex","justify-between","items-center","align-middle","w-full"],["type","submit","matRipple","",1,"bg-white","px-6","py-3","border","border-indigo-500","text-sm","font-medium","rounded-md","text-indigo-500","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500","custom-ripple",3,"disabled","matRippleCentered","matRippleDisabled","matRippleUnbounded","click"],["matRipple","",1,"disabled:bg-indigo-400","flex","justify-center","items-center","px-6","py-3","border","border-transparent","rounded-md","shadow-sm","text-base","font-medium","text-white","bg-indigo-600","hover:bg-indigo-700","custom-ripple",3,"disabled","matRippleCentered","matRippleDisabled","matRippleUnbounded","click"],[1,"flex","text-sm","justify-center","text-center","w-full","text-red-600"]],template:function(t,o){if(1&t&&(e.YNc(0,D,1,0,"app-loader",0),e.TgZ(1,"div",1)(2,"div",2),e._UZ(3,"app-data"),e.TgZ(4,"form",3)(5,"div",4)(6,"p",5),e._uU(7,"Table Number:"),e.qZA(),e.TgZ(8,"select",6),e.YNc(9,z,2,2,"option",7),e.qZA(),e.YNc(10,J,2,0,"div",8),e.TgZ(11,"p",9),e._uU(12,"Table number is where you are sitting, table number is important to server the food to right person."),e.qZA()()(),e.YNc(13,j,2,0,"div",10),e.qZA(),e.TgZ(14,"section",11)(15,"div",12),e.YNc(16,G,5,8,"div",13),e.YNc(17,q,2,0,"div",14),e.YNc(18,M,2,0,"div",15),e.qZA()()()),2&t){let a;e.Q6J("ngIf",o.isLoading),e.xp6(4),e.Q6J("formGroup",o.tableFormGroup),e.xp6(4),e.Q6J("ngClass",e.WLB(9,Q,(null==(a=o.tableFormGroup.get("tableNumber"))?null:a.errors)&&((null==(a=o.tableFormGroup.get("tableNumber"))?null:a.touched)||(null==(a=o.tableFormGroup.get("tableNumber"))?null:a.dirty)),!(null!=(a=o.tableFormGroup.get("tableNumber"))&&a.errors&&(null!=(a=o.tableFormGroup.get("tableNumber"))&&a.touched||null!=(a=o.tableFormGroup.get("tableNumber"))&&a.dirty)))),e.xp6(1),e.Q6J("ngForOf",o.tables),e.xp6(1),e.Q6J("ngIf",o.checkTableError()),e.xp6(3),e.Q6J("ngIf",!o.isLogin&&!o.isLoading),e.xp6(3),e.Q6J("ngIf",o.isLogin&&!o.checkTableError()),e.xp6(1),e.Q6J("ngIf",!o.isLogin),e.xp6(1),e.Q6J("ngIf",o.checkTableError())}},directives:[w.O5,O.R,N,g._Y,g.JL,g.sg,g.EJ,g.JJ,g.u,w.mk,w.sg,g.YN,g.Kr,Y.G,Z.wG],styles:[""]}),i})();var A=u(5245);let H=(()=>{class i{constructor(t,o,a,r){this.route=t,this.router=o,this.mainService=a,this.dialog=r,this.error="",this.route.queryParams.subscribe(d=>{this.error=d.error||"Some error occurred, try again after some time"})}ngOnInit(){this.mainService.setshowPaymentStatus(!1)}navigateToCheckout(){var t,o;null===(o=null===(t=this.route)||void 0===t?void 0:t.parent)||void 0===o||o.params.subscribe(a=>{a&&a.name?this.route.queryParams.subscribe(r=>{r.tb&&this.router.navigate(["/restaurant",a.name,"cart"],{queryParams:{tb:r.tb}})}):this.mainService.openDialog("Error","Invalid Url","E")})}openDialog(t,o,a){this.dialog.open(k.u,{data:{message:o,type:a,heading:t},panelClass:"popUp-modalbox"})}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(p.gz),e.Y36(p.F0),e.Y36(T.J),e.Y36(_.uw))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-fail"]],decls:19,vars:4,consts:[["aria-labelledby","modal-title","role","dialog","aria-modal","true",1,"fixed","z-10","inset-0","overflow-y-auto"],[1,"flex","items-start","justify-center","min-h-screen","pt-4","px-4","pb-20","text-center","sm:block","sm:p-0"],["aria-hidden","true",1,"hidden","sm:inline-block","sm:align-middle","sm:h-screen"],[1,"border","border-gray-100","dark:border-gray-700","relative","inline-block","align-bottom","rounded-lg","text-left","overflow-hidden","transform","transition-all","sm:my-8","sm:align-middle","max-w-lg","w-full"],[1,"bg-white","dark:bg-slate-800","px-4","pt-5","pb-4","sm:p-6","sm:pb-4"],[1,"flex","items-center","flex-col"],[1,"mx-auto","flex-shrink-0","flex","items-center","justify-center","h-12","w-12","rounded-full","bg-red-100"],["aria-hidden","false","aria-label","error",1,"h-6","w-6","text-red-600"],[1,"mt-3","text-center"],["id","modal-title",1,"text-lg","leading-6","font-medium","text-gray-900","dark:text-white"],[1,"mt-2"],[1,"text-sm","text-gray-500","dark:text-gray-200"],[1,"px-4","py-3","sm:px-6","sm:flex","sm:flex-row-reverse"],["matRipple","",1,"mt-3","w-full","cursor-pointer","inline-flex","justify-center","rounded-md","border","dark:bg-slate-700","dark:hover:bg-slate-800","dark:text-white","dark:border-gray-600","border-gray-300","shadow-sm","px-4","py-2","bg-white","text-base","font-medium","text-gray-700","hover:bg-gray-50","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500","custom-ripple",3,"matRippleCentered","matRippleDisabled","matRippleUnbounded","click"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"span",2),e._uU(3,"\u200b"),e.qZA(),e.TgZ(4,"div",3)(5,"div",4)(6,"div",5)(7,"div",6)(8,"mat-icon",7),e._uU(9,"error"),e.qZA()(),e.TgZ(10,"div",8)(11,"h3",9),e._uU(12,"Payment Failed"),e.qZA(),e.TgZ(13,"div",10)(14,"p",11),e._uU(15),e.qZA()()()()(),e.TgZ(16,"div",12)(17,"div",13),e.NdJ("click",function(){return o.navigateToCheckout()}),e._uU(18," Try again "),e.qZA()()()()()),2&t&&(e.xp6(15),e.Oqu(o.error),e.xp6(2),e.Q6J("matRippleCentered",!1)("matRippleDisabled",!1)("matRippleUnbounded",!1))},directives:[A.Hw,Z.wG],styles:[""]}),i})();function K(i,n){if(1&i&&(e.TgZ(0,"p",14),e._uU(1),e.qZA()),2&i){const t=e.oxw();e.xp6(1),e.Oqu(t.message)}}const V=function(){return["orders"]},W=[{path:":name",component:(()=>{class i{constructor(){}ngOnInit(){}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-home"]],decls:1,vars:0,template:function(t,o){1&t&&e._UZ(0,"router-outlet")},directives:[p.lC],styles:[""]}),i})(),children:[{path:"checkout",component:B,pathMatch:"full"},{path:"success",component:(()=>{class i{constructor(t,o,a,r){this.mainService=t,this.router=o,this.dialog=a,this.route=r,this.message="",this.route.queryParams.subscribe(d=>{this.message=d.message||"Success"})}ngOnInit(){this.mainService.setshowPaymentStatus(!1)}navigateToOrders(){var t,o;null===(o=null===(t=this.route)||void 0===t?void 0:t.parent)||void 0===o||o.params.subscribe(a=>{a&&a.name?this.route.queryParams.subscribe(r=>{r.tb&&this.router.navigate(["/restaurant",a.name,"orders"],{queryParams:{tb:r.tb}})}):this.mainService.openDialog("Error","Invalid Url","E")})}openDialog(t,o,a){this.dialog.open(k.u,{data:{message:o,type:a,heading:t},panelClass:"popUp-modalbox"})}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(T.J),e.Y36(p.F0),e.Y36(_.uw),e.Y36(p.gz))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-success"]],decls:18,vars:6,consts:[["aria-labelledby","modal-title","role","dialog","aria-modal","true",1,"fixed","z-10","inset-0","overflow-y-auto"],[1,"flex","items-start","justify-center","min-h-screen","pt-4","px-4","pb-20","text-center","sm:block","sm:p-0"],["aria-hidden","true",1,"hidden","sm:inline-block","sm:align-middle","sm:h-screen"],[1,"border","border-gray-100","dark:border-gray-700","relative","inline-block","align-bottom","rounded-lg","text-left","overflow-hidden","transform","transition-all","sm:my-8","sm:align-middle","max-w-lg","w-full"],[1,"bg-white","dark:bg-slate-800","px-4","pt-5","pb-4","sm:p-6","sm:pb-4"],[1,"flex","items-center","flex-col"],[1,"mx-auto","flex-shrink-0","flex","items-center","justify-center","h-12","w-12","rounded-full","bg-green-100"],["aria-hidden","false","aria-label","Success",1,"h-6","w-6","text-green-600"],[1,"mt-3","text-center"],["id","modal-title",1,"text-lg","leading-6","dark:text-white","font-medium","text-gray-900"],[1,"mt-2"],["class","text-sm text-gray-500 dark:text-gray-400",4,"ngIf"],[1,"px-4","py-3","sm:px-6","sm:flex","sm:flex-row-reverse"],["type","button","matRipple","",1,"mt-3","w-full","inline-flex","justify-center","rounded-md","border","border-gray-300","shadow-sm","px-4","py-2","bg-white","dark:bg-slate-700","dark:text-white","dark:border-gray-600","text-base","font-medium","text-gray-700","focus:outline-none","focus:ring-2","focus:ring-offset-2","focus:ring-indigo-500","custom-ripple",3,"routerLink","matRippleCentered","matRippleDisabled","matRippleUnbounded","click"],[1,"text-sm","text-gray-500","dark:text-gray-400"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"span",2),e._uU(3,"\u200b"),e.qZA(),e.TgZ(4,"div",3)(5,"div",4)(6,"div",5)(7,"div",6)(8,"mat-icon",7),e._uU(9,"check_circle"),e.qZA()(),e.TgZ(10,"div",8)(11,"h3",9),e._uU(12,"Success"),e.qZA(),e.TgZ(13,"div",10),e.YNc(14,K,2,1,"p",11),e.qZA()()()(),e.TgZ(15,"div",12)(16,"a",13),e.NdJ("click",function(){return o.navigateToOrders()}),e._uU(17," Go to Orders "),e.qZA()()()()()),2&t&&(e.xp6(14),e.Q6J("ngIf",o.message),e.xp6(2),e.Q6J("routerLink",e.DdM(5,V))("matRippleCentered",!1)("matRippleDisabled",!1)("matRippleUnbounded",!1))},directives:[A.Hw,w.O5,p.yS,Z.wG],styles:[""]}),i})(),pathMatch:"full",canActivate:[U]},{path:"failed",component:H,pathMatch:"full",canActivate:[U]},{path:"**",redirectTo:"/404"}]}];let $=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[[p.Bz.forChild(W)],p.Bz]}),i})();var ee=u(8524),te=u(5899),oe=u(2096);let ie=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({providers:[],imports:[[w.ez,g.UX,$,ee.z,te.Cv,oe.x,_.Is,A.Ps,Z.si]]}),i})()}}]);