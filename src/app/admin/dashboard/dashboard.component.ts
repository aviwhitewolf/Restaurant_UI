import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { OrderNotificationComponent } from 'src/app/reusable/order-notification/order-notification.component';
import { SocketService } from 'src/app/socket.service';
import { UserInfoComponent } from 'src/app/user/user-info/user-info.component';
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public showSideBar: boolean = false
  public showSubMenu: boolean = false
  public showDropDownMenu: boolean = false
  public sideBarMenu: any
  public isLoggedIn: boolean = false
  public loading: boolean = true
  private jwt: string = ""
  private routeQueryParams$!: Subscription;


  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private socket: SocketService,
    private _snackBar: MatSnackBar,
    private swPush: SwPush,
    private deviceInformationService: DeviceDetectorService
  ) {

    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    this.jwt = user.jwt || ""
    if (this.jwt && this.jwt.length > 0) {
      this.loading = false
      this.isLoggedIn = true
    } else {
      this.router.navigate([], { queryParams: { userInfo: true } });
      this.isLoggedIn = false
      this.loading = false

    }

  }

  ngOnInit(): void {
    this.loading = true
    // subscribe to url to open user info dialog
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {

      if (params['userInfo']) {
        this.openUserInfoDialog();
      }
    });

    this.route?.params.subscribe((mparam: any) => {

      if (mparam && mparam['slug']) {

        this.subscribeToNotifications(mparam['slug'])

        this.getAdminMenu(mparam['slug'])
      } else {
        this.loading = false
        this.mainService.openDialog("Error", "Some thing went wrong.", "E", false, false)
      }
    })

    this.connectSocket()


  }
  async subscribeToNotifications(slug: string) {

    if (this.swPush.isEnabled) {

      Notification.requestPermission().then(async (perm) => {
        if (perm === 'granted') {
          
          //send sub to the server
          const deviceInfo = this.deviceInformationService.getDeviceInfo().deviceType + '::' +
            this.deviceInformationService.getDeviceInfo().device + "::" +
            this.deviceInformationService.getDeviceInfo().os + "::" +
            this.deviceInformationService.getDeviceInfo().browser

          try {

            const previousSubscription = await this.adminService.findSubscribeToWebpushNotification(deviceInfo, slug)
            console.log("Previous Subscription Data", previousSubscription.data)

          } catch (error) {

            console.log("Error=====", error)

            this.swPush.requestSubscription({
              serverPublicKey: Constants.VAPID_PUBLIC_KEY
            }).then(sub => {

              const data = {
                sub, deviceInfo
              }
              
              this.adminService.subscribeToWebpushNotification(data, slug).then((res) => {

                console.log("User Register successfully for notification", res)

              }).catch((err) => {
                console.error("Error Registering user in the server", err)
              })

            }).catch(err => console.error("Could not subscribe to notifications", err));


          }

        } else {

          await Notification.requestPermission()
          this.mainService.openDialog("Warning", "Notification is not enabled, we won't be able to notify you whenever a new order is there.", "W", false, false)
        }
      })
    } else {

      await Notification.requestPermission()
      this.mainService.openDialog("Warning", "Notification is not enabled, we won't be able to notify you whenever a new order is there.", "W", false, false)
    }
  }

  getAdminMenu(slug: string) {
    this.adminService.getAdminMenu(slug)
      .then((result) => {
        this.sideBarMenu = result?.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)
      })
  }

  public isActive(base: string): boolean {
    return this.router.url.includes(`/${base}`);
  }

  openUserInfoDialog() {

    const dialogRef = this.dialog.open(UserInfoComponent, {
      width: '80%',
      maxWidth: '30rem',
      panelClass: 'custom-user-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([], { relativeTo: this.route },);
    });
  }

  private async connectSocket() {

    this.socket.listen("disconnect").subscribe((data) => {
      console.log("Disconnect", data)
    })

    this.socket.listen("error").subscribe((data) => {
      console.log("Disconnect", data)
    })

    this.socket.listen("connect_error").subscribe((data) => {
      console.log("Connect error", data)
    })


    this.socket.listen(Constants.SOCKET_ORDER_RECIEVED).subscribe((data: any) => {
      const audio = new Audio()
      audio.src = '../../../assets/sounds/order_received.mp3'
      audio.load()
      audio.play()
      console.log("Socket Data Data", data)

      this._snackBar.openFromComponent(OrderNotificationComponent, {
        data: data,
        panelClass: 'snack-bar-order-notification',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000
      });

    })

  }



}
