import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {PostService} from '../../../core/services/post.service';
import {PostListItem} from '../../../core/models/post.model';

@Component({
  selector: 'app-post-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-hub.component.html',
  styleUrl: './post-hub.component.css'
})
export class PostHubComponent implements OnInit {

  private postService = inject(PostService);

  posts = signal<PostListItem[]>([]);
  isLoading= signal(true);

  ngOnInit() {
    this.loadPublicPosts();
  }

  loadPublicPosts() {
    this.postService.getPublishedPosts(0,10).subscribe({
      next: (page) => {
        this.posts.set(page.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    })
  }


}
