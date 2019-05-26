import { Component, OnInit, HostListener } from '@angular/core';
import { CommonServices } from '../../services/common.service';

export class Page {
  size: number = 0;
  totalElements: number = 0;
  totalPages: number = 0;
  pageNumber: number = 0;
}

declare var $: any;


@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  blogList: any;
  userid: string;
  loadingInProgress: boolean = false;

  page = new Page();
  rows = [];
  ResponseToShow = [];
  offset: number = 0;
  cache: any = {};
  counter = 1;
  lastPage = false;
  loop = [];
  isRestScroll: boolean = false;


  constructor(private objCommonServices: CommonServices) {
    this.userid = localStorage.getItem("id")
    this.page.size = 5;
    this.loop.length = 5;
    this.isRestScroll = false
    this.objCommonServices.blogList.subscribe(res => {
      this.ResetValues();
      setTimeout(() => {
        this.GetBlogList(1);
      }, 200);

    })
  }


  ngOnInit() {
    this.GetBlogList(1)
  }


  removeBlog(blogId) {
    this.ResetValues();
    this.isRestScroll = true;
    this.objCommonServices
      .removeBlog(blogId)
      .subscribe(res => {
        this.GetBlogList(1);
      })
  }


  GetBlogList(pagenumber: number) {
    if (!this.loadingInProgress) {

      this.page.pageNumber = pagenumber;
      if (this.cache[this.counter]) return;

      this.loadingInProgress = true;

      this.objCommonServices.getBlogList(this.page.pageNumber, this.page.size)
        .subscribe(res => {

          if (res != null) {
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

          this.loadingInProgress = false
          this.isRestScroll = false;

        }, error => { throw error; });
    }

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


  EditBlog(blogId) {
    this.objCommonServices.getBlogDetails(Number(blogId)).subscribe(resp => {
      var response = resp;
      if (response != null) {
        this.objCommonServices.editBlog.emit(response);
      }
    });
  }


  GenerateTags(tags) {
    return this.objCommonServices.GenerateTags(tags)
  }

  @HostListener("window:scroll", ['$event'])
  onWindowScroll() {
    if ((($(window).scrollTop() + $(window).height()) > ($(document).height() - 174)) && !this.loadingInProgress && !this.lastPage && !this.isRestScroll) {
      this.GetBlogList(++this.counter);
    }
  }
}

