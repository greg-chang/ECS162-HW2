<script lang="ts">
  import './app.css';
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';

  let apiKey: string = '';
  let page = 0;
  let loading = false;
  let hasMore = true;
  
  interface Article {
    web_url: string;
    headline: { main: string };
    snippet: string;
    multimedia: {
      caption: string;
      credit: string;
      default: {
        url: string;
        height: number;
        width: number;
      };
      thumbnail: {
        url: string;
        height: number;
        width: number;
      };
    };
  }
  
  let articles: Article[] = [];
  let locations = ['Sacramento', 'Davis'];

  // Fetch API key and articles sequentially
  onMount(() => {
    fetchData();
  });

  async function fetchData(isLoadMore = false) {
    if (loading || !hasMore) return;
    
    try {
      loading = true;
      
      if (!isLoadMore) {
        // Only fetch API key on initial load
        const keyRes = await fetch('/api/key');
        const keyData = await keyRes.json();
        apiKey = keyData.apiKey;
      }

      // Create location filter query
      const locationQuery = locations
        .map(loc => `timesTag.location.contains:"${loc}"`)
        .join(' OR ');
      
      // Fetch articles with pagination
      const articlesRes = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=(${locationQuery})&page=${page}&api-key=${apiKey}`
      );
      const articlesData = await articlesRes.json();
      
      if (isLoadMore) {
        articles = [...articles, ...articlesData.response.docs];
      } else {
        articles = articlesData.response.docs;
      }

      // Check if we have more articles to load
      hasMore = articlesData.response.docs.length > 0;
      page++;
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      loading = false;
    }
  }

  // Intersection Observer for infinite scroll
  let loadMoreTrigger: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchData(true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  });

  // Helper function to get the image URL from an article's multimedia
  function getArticleImage(article: Article): string {
    if (article.multimedia && article.multimedia.default) {
      return article.multimedia.default.url;
    }
    return '/image1.png'; // Fallback image
  }
</script>

<main>
    <Header {apiKey} />

    <section>
      <div class="container">
        {#each articles as article, i}
          <div class="column">
            <div class="section">
              {#if article.multimedia && article.multimedia.default}
                <img src={article.multimedia.default.url} alt={article.headline.main}>
              {:else}
                <img src="/image1.png" alt="No image available">
              {/if}
              <h2>{article.headline.main}</h2>
              <p>{article.snippet}</p>
              {#if article.multimedia && article.multimedia.caption}
                <p class="caption">{article.multimedia.caption}</p>
              {/if}
            </div>
          </div>
        {/each}
        
        {#if hasMore}
          <div class="load-more" bind:this={loadMoreTrigger}>
            {#if loading}
              <p>Loading more articles...</p>
            {/if}
          </div>
        {/if}
      </div>
    </section>
</main>

<style>
  .load-more {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }
</style>
