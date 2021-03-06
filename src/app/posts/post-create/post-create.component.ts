import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  isLoading = false;
  post: any;
  form: FormGroup;
  imagePreview : String | null | ArrayBuffer;
  private mode?: string = 'create';
  private postId: any = '';
  constructor(public postService: PostService, public router: ActivatedRoute) {}
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      image : new FormControl(null , {validators : [Validators.required]})
    });
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postService
          .getPost(this.postId)
          .subscribe((postData) => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
            });
          });
        console.log('ediiiiiiiit***:', this.post);
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode == 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    this.form.reset();
  }
  onImagePicked(event : Event ){
    let file : any = (event.target as HTMLInputElement);
    file = file?.files[0];
    this.form.patchValue({image : file})
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file)

  }

}
