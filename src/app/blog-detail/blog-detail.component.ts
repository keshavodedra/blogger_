import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonServices } from '../../services/common.service';

declare var $: any;


export class Page {
  size: number = 0;
  totalElements: number = 0;
  totalPages: number = 0;
  pageNumber: number = 0;
}

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {

  isPageLoading: boolean = false;
  page = new Page();
  rows = [];
  ResponseToShow = [];
  offset: number = 0;
  cache: any = {};
  counter = 1;
  lastPage = false;
  loop = [];

  avatar: string = "";
  description: string = "";
  name: string = "";
  tags: string = "";
  createdAt;
  postedBy;

  Comment: string;
  ShowComment: boolean = false;
  blogId;
  commentList: any;
  ShowCommentList: boolean = false;
  TotalComments;
  username: string;
  restrictComment: boolean = true;
  userId: string;
  loadingInProgress: boolean = false;
  isRestScroll: boolean = false;
  uId: any;


  constructor(private route: ActivatedRoute, private objCommonServices: CommonServices) {
    this.isPageLoading = true;
    this.isRestScroll = false;

    this.blogId = this.route.snapshot.params["id"];

    if (localStorage.getItem("uname") != null) {
      this.username = localStorage.getItem("uname");
    }
    if (localStorage.getItem("id") != null) {
      this.userId = localStorage.getItem("id");
      if (this.userId != undefined) {
        this.restrictComment = false;
      }
    }
    
    this.page.size = 5;
    this.loop.length = 5;
  }

  ngOnInit() {
    this.ResetValues()
    this.GetBlogDetails();
  }

  GetBlogDetails() {
    this.objCommonServices.getBlogDetails(Number(this.blogId)).subscribe(resp => {
      var response = resp;
      if (response != null) {
        this.isPageLoading = false;

        this.avatar = response["avatar"];
        this.tags = response["tags"];
        this.name = response["name"];
        this.description = response["description"];
        this.createdAt = response["createdAt"];
        this.postedBy = response["username"];
        this.uId = response["userid"];
        

        setTimeout(() => {
          this.GetBlogComments(1);
        }, 100);

      }
    }, error => { throw error; });
  }

  GenerateTags(tags) {
    return this.objCommonServices.GenerateTags(tags)
  }

  
  EditBlog(blogId) {
    this.objCommonServices.getBlogDetails(Number(blogId)).subscribe(resp => {
      var response = resp;
      if (response != null) {
        this.objCommonServices.editBlog.emit(response);
      }
    });
  }


  GetBlogComments(pagenumber: number) {

    if (!this.loadingInProgress) {
      this.page.pageNumber = pagenumber;
      if (this.cache[this.counter]) return;

      this.loadingInProgress = true;

      this.objCommonServices.getBlogComments(this.blogId, this.page.pageNumber, this.page.size)
        .subscribe(res => {

          if (res != null) {

            this.commentList = res;
            if (this.commentList.length > 0) {

              this.ShowCommentList = true;

              var data;
              data = res;

              const start = (this.page.pageNumber) * this.page.size;
              const rows = [...this.ResponseToShow];

              rows.splice(start, 0, ...data);

              this.ResponseToShow = rows;
              this.cache[this.page.pageNumber] = true;

              if (data.length < this.page.size) {
                this.lastPage = true;
              }
              else {
                this.lastPage = false;
              }

            }
            else {
              this.lastPage = true;
            }

          }
          else {
            this.lastPage = true;
          }

          this.isRestScroll = false;
          this.loadingInProgress = false
        }, error => { throw error; });
    }

  }



  ShowCommentBox() {
    this.ShowComment = true;
  }

  PostComment() {
    this.ShowComment = false;
    this.isRestScroll = true;
    var comment = this.Comment;
    var blogId = this.blogId;
    this.ResetValues();

    var postData = {
      "blogId": blogId,
      "comment": comment,
      "username": this.username,
      "userid": this.userId,
      "createdAt": new Date()
    }
    this.objCommonServices
      .postComments(JSON.stringify(postData), blogId)
      .subscribe(res => {
        this.Comment = '';
        this.GetBlogComments(1);
      });
  }

  removeComment(commentId) {
    this.ShowCommentList = false;
    this.isRestScroll = true;
    this.objCommonServices
      .removeComment(this.blogId, commentId)
      .subscribe(res => {
        this.ResetValues();
        setTimeout(() => {
          this.GetBlogComments(1);
        }, 200);

      })
  }

  ResetValues() {
    this.page = new Page();
    this.rows = [];
    this.ResponseToShow = [];
    this.counter = 1;
    this.lastPage = false;
    this.loadingInProgress = false;
    this.lastPage = false;
    this.cache = {};
    this.page.pageNumber = 1;
    this.page.size = 5;
  }


  @HostListener("window:scroll", ['$event'])
  onWindowScroll() {
    if ((($(window).scrollTop() + $(window).height()) > ($(document).height() - 174)) && !this.loadingInProgress && !this.lastPage && !this.isRestScroll) {
      this.GetBlogComments(++this.counter);
    }
  }


}