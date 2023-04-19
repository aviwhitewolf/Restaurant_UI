import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Resolve, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { OrderNotificationComponent } from 'src/app/reusable/order-notification/order-notification.component';
import { SocketService } from 'src/app/socket.service';
import { UserInfoComponent } from 'src/app/user/user-info/user-info.component';
import { UserService } from 'src/app/user/user.service';
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
  public userInfo: any
  private routeQueryParams$!: Subscription;


  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private socket: SocketService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private swPush: SwPush,
    private deviceInformationService: DeviceDetectorService,
    private restaurantService: RestaurantService
  ) {
  }

  ngOnInit(): void {


    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    this.jwt = user.jwt || ""
    if (this.jwt && this.jwt.length > 0) {
      this.loading = false
      this.isLoggedIn = true
      const restaurantSlug = this.restaurantService.getRestaurantSlug()
      if (restaurantSlug) {
        this.getUserInfo(restaurantSlug)
      } else {
        this.loading = false
        this.mainService.openDialog("Error", "Some thing went wrong.", "E", false, false)
      }


    } else {
      this.router.navigate([], { queryParams: { userInfo: true } });
      this.isLoggedIn = false
      this.loading = false

    }

    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {

      if (params['userInfo']) {
        this.openUserInfoDialog();
      }
    });
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
            if (!previousSubscription) throw new Error("Not Found in the database")

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
          // this.mainService.openDialog("Warning", "Notification is not enabled, we won't be able to notify you whenever a new order is there.", "W", false, false)
        }
      })
    } else {

      await Notification.requestPermission()
      // this.mainService.openDialog("Warning", "Notification is not enabled, we won't be able to notify you whenever a new order is there.", "W", false, false)
    }
  }

  async getUserInfo(slug: string) {

    this.loading = true
    this.userService.checkLoggedIn(this.mainService.getToLocalStorage(Constants.LOCAL_USER)?.jwt)
      .then((res: any) => {
        this.loading = false
        this.userInfo = res?.data
        this.subscribeToNotifications(slug)
        this.connectSocket(slug)
        this.getAdminMenu(slug)
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)

      })

  }

  getAdminMenu(slug: string) {
    this.loading = true
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

  private async connectSocket(restaurantSlug: string) {

    this.socket.listen("disconnect", restaurantSlug).subscribe((data) => {
      console.log("Disconnect", data)
    })

    this.socket.listen("error", restaurantSlug).subscribe((data) => {
      console.log("Disconnect", data)
    })

    this.socket.listen("connect_error", restaurantSlug).subscribe((data) => {
      console.log("Connect error", data)
    })


    this.socket.listen(Constants.SOCKET_ORDER_RECIEVED, restaurantSlug).subscribe((data: any) => {
      const audio = new Audio()
      audio.src = '../../../assets/sounds/order_received.mp3'
      audio.load()
      audio.play()

      this._snackBar.openFromComponent(OrderNotificationComponent, {
        data: data,
        panelClass: 'snack-bar-order-notification',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 300000
      });

    })

  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

}
