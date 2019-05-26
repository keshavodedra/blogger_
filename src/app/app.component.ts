import { Component, OnInit, setTestabilityGetter } from '@angular/core';
import { Router, Event } from '@angular/router';
import { CommonServices } from 'src/services/common.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})

export class AppComponent implements OnInit {
  title = 'Blogger For Bloovo';
  displayName;
  blogDescription: string = '';
  userid: string = '';
  blogTags: any = [];
  blogDetails: any;
  isEdit: boolean = false
  blogId: any;


  constructor(private router: Router, private objCommonServices: CommonServices) {
    this.objCommonServices.displayName.subscribe(res => {
      this.displayName = res;
    })

    this.blogId = 0;

    this.objCommonServices.editBlog.subscribe(res => {
      if (res != null && res != undefined) {
        this.blogDetails = res;
        this.isEdit = true;
        this.blogDescription = this.blogDetails["description"];
        this.blogId = this.blogDetails["id"];
        this.blogTags = [];
        var tags = this.blogDetails["tags"];

        var allTag = [];
        if (tags != null && tags != undefined) {
          if (tags.includes('~')) {
            allTag = tags.split('~');
          }
          else {
            allTag.push(tags);
          }
        }
        this.blogTags = [];
        var tagsMeta = [];
        for (var i = 0; i < allTag.length; i++) {
          this.blogTags.push(allTag[i]);
          tagsMeta.push({ tag: allTag[i] });
        }
        setTimeout(() => {
          $('.chips-initial').material_chip({
            data: tagsMeta,
          });
        }, 200);

        // if (tags != undefined) {
        //   var tagsMeta = [];
        //   for (var i = 0; i < tags.length; i++) {
        //     this.blogTags.push(tags[i]);
        //     tagsMeta.push({ tag: tags[i] });
        //   }
        //   setTimeout(() => {
        //     $('.chips-initial').material_chip({
        //       data: tagsMeta,
        //     });
        //   }, 200);
        // }

        setTimeout(() => {
          $("#addBlog").modal('open');
        }, 200);

      }
      else {
        this.blogDetails = undefined;
      }
    });


    this.userid = localStorage.getItem("id")
  }

  ngOnInit() {
    if (this.displayName == undefined) {
      if (localStorage.getItem("uname") != null) {
        this.displayName = localStorage.getItem("uname");
      }
    }
  }

  ngAfterViewInit() {
    $('.modal').modal();
    $('.chips').material_chip();

    $('.chips').on('chip.add', (e, chip) => {
      this.blogTags.push(chip.tag);
    });

    $('.chips').on('chip.delete', (e, chip) => {
      var newArr = [];
      setTimeout(() => {
        newArr = this.blogTags.filter(item => item !== chip.tag)
        this.blogTags = newArr
      }, 200);
    });
  }

  ShowAddBlogModel() {
    this.ResetModel();
    setTimeout(() => {
      $("#addBlog").modal('open');
    }, 200);

  }
  ResetModel() {
    this.isEdit = false;
    this.blogDescription = '';
    this.blogTags = [];
  }

  PostBlog() {
    debugger;
    var name = this.displayName;
    var desc = this.blogDescription;
    var tags = this.blogTags;

    var tag = "";
    if (tags.length > 0) {
      for (var i = 0; i < tags.length; i++) {
        if (tag == undefined) {
          tag = tags[i];
        }
        else {
          tag += "~" + tags[i];
        }
      }
      if (tag.startsWith('~')) {
        tag = tag.substr(1);
      }
    }

    var data = {
      "description": desc,
      "username": name,
      "userid": localStorage.getItem("id"),
      "createdAt": new Date(),
      "tags": tag
    }

    if (this.blogId > 0 && this.blogId != undefined) {
      this.UpdateBlog(data, this.blogId);
    }
    else {
      this.AddBlog(data);
    }
  }

  AddBlog(data) {
    this.objCommonServices.postBlog(JSON.stringify(data)).subscribe(resp => {
      var response = resp;
      if (response != null) {
        this.blogDescription = '';
        $("#addBlog").modal('close');
        this.objCommonServices.blogList.emit();
        this.router.navigateByUrl('/blogs');
      }
    });
  }


  UpdateBlog(data, id) {
    this.objCommonServices.updateBlog(JSON.stringify(data), Number(id)).subscribe(resp => {
      var response = resp;
      if (response != null) {
        this.blogDescription = '';
        $("#addBlog").modal('close');
        this.objCommonServices.blogList.emit();
        this.router.navigateByUrl('/blogs');
      }
    });
  }

}
