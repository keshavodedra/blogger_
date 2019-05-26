import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, retry, catchError } from 'rxjs/operators';
import { ResponseModel, Header } from '../models/response.model';
import { environment } from '../environments/environment';


@Injectable()
export class CommonServices {

  apiURL: string = environment.apiUrl;

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  options;

  displayName: EventEmitter<any> = new EventEmitter<any>();
  blogList: EventEmitter<any> = new EventEmitter<any>();
  editBlog: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    this.options = {
      headers: this.headers
    }
  }
  getBlogList(page: number, pageSize: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.apiURL + '/blogs?page=' + page + '&limit=' + pageSize + '&sortBy=createdAt&order=desc').pipe(catchError(this.handleError)
    )
  }
  getBlogDetails(id: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.apiURL + '/blogs/' + id).pipe(catchError(this.handleError))
  }

  getBlogComments(id: number, page: number, pageSize: number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.apiURL + '/blogs/' + id + '/comments?page=' + page + '&limit=' + pageSize + '&sortBy=createdAt&order=desc').pipe(catchError(this.handleError))
  }

  getUserList(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.apiURL + '/users').pipe(catchError(this.handleError)
    )
  }
  getUserDetails(id: Number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.apiURL + '/users/' + id).pipe(catchError(this.handleError)
    )
  }

  updateUserDetails(body, id: Number): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(this.apiURL + '/users/' + id, body, this.options).pipe(catchError(this.handleError)
    )
  }

  checkUserCredentials(username: string, password: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.apiURL + '/blogs?username=' + username + "&password=" + password).pipe(catchError(this.handleError))
  }

  registerUser(body: any): Observable<ResponseModel> {
    return this.http.post(this.apiURL + "/users/", body, this.options).pipe(catchError(this.handleError))
  }

  postComments(body: any, blogId: number): Observable<ResponseModel> {
    return this.http.post(this.apiURL + "/blogs/" + blogId + "/comments/", body, this.options).pipe(catchError(this.handleError))
  }

  removeBlog(blogId: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(this.apiURL + '/blogs/' + blogId).pipe(catchError(this.handleError))
  }

  removeComment(blogId: string, commentId: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(this.apiURL + '/blogs/' + blogId + "/comments/" + commentId).pipe(catchError(this.handleError))
  }


  postBlog(body: any): Observable<ResponseModel> {
    return this.http.post(this.apiURL + "/blogs/", body, this.options).pipe(catchError(this.handleError))
  }

  updateBlog(body, id: Number): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(this.apiURL + '/blogs/' + id, body, this.options).pipe(catchError(this.handleError)
    )
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/js/data.json");
  }


  handleError(error: any): Promise<any> {
    debugger;
    if (error["status"] == 404) {
      window.location.href = environment.domainUrl;
    }
    return Promise.reject(error.message || error);
  }


  // Common Functions :Start
  // GenerateTags(tags) {
  //   var html;
  //   for (var i = 0; i < tags.length; i++) {
  //     if (html == undefined) {
  //       html = "<div class='chip'> " + tags[i] + " </div>";
  //     }
  //     else {
  //       html += "<div class='chip'> " + tags[i] + " </div>";
  //     }
  //   }
  //   return html;
  // }

  GenerateTags(tags) {
    var allTag = [];
    if (tags != null && tags != undefined) {
      if (tags.includes('~')) {
        allTag = tags.split('~');
      }
      else {
        allTag.push(tags);
      }
    }
    var html;
    for (var i = 0; i < allTag.length; i++) {
      if (html == undefined) {
        html = "<div class='chip'> " + allTag[i] + " </div>";
      }
      else {
        html += "<div class='chip'> " + allTag[i] + " </div>";
      }
    }
    return html;
  }

  // Common Functions : End
}
