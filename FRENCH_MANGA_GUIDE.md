# 🇫🇷 French Manga APIs - Usage Guide

## Available French Scanlation Providers

The `/src/routes/french/` folder contains **8 French manga scanlation groups** integrated via Paperback extensions:

### **Providers List:**

| Provider | Domain | Template | Description |
|----------|--------|----------|-------------|
| **AstralManga** | astral-manga.fr | Madara | French manga scans |
| **LelManga** | lelmanga.com | MangaReader | French manga reader |
| **MangaScantrad** | mangascantrad.com | Madara | French manga scanlation |
| **MangasOrigines** | mangas-origines.fr | Madara | French manga origins |
| **PantheonScan** | pantheonscan.it | Madara | Pantheon scan group |
| **PhenixScans** | phenixscans.com | Madara | Phoenix scans group |
| **SushiScan** | sushiscan.su | Madara | Sushi scans community |
| **SushiScans** | sushiscans.com | Madara | Sushi scans alternative |

## How to Use French APIs

### **Method 1: Direct Access via Main Manga Routes**

Since these are manga providers, use the existing `/manga` routes:

```bash
# Search across all French providers
GET http://localhost:3000/manga/search?query=naruto&providers=astralmanga,lelmanga,mangascantrad

# Search a specific French provider
GET http://localhost:3000/manga/astralmanga/naruto

# Get manga details
GET http://localhost:3000/manga/astralmanga/info/{mangaId}

# Read chapters
GET http://localhost:3000/manga/astralmanga/read/{chapterId}
```

### **Method 2: Using the French Metadata Endpoint**

Get information about available French providers:

```bash
GET http://localhost:3000/french/
```

Response:
```json
{
  "message": "Welcome to Consumet French Manga APIs",
  "providers": [
    {
      "name": "AstralManga",
      "url": "https://astral-manga.fr",
      "type": "Madara",
      "description": "French manga scans"
    },
    ...
  ]
}
```

## Frontend Integration

### **Option 1: Add French Tab to Website**

Add a new tab for French manga:

```javascript
// In app.js, add to loadAllTrending():
if(currentTab==='french'){
  eps=[
    {url:API_BASE+'/manga/astralmanga/trending',type:'manga'},
    {url:API_BASE+'/manga/lelmanga/trending',type:'manga'},
    {url:API_BASE+'/manga/mangascantrad/trending',type:'manga'},
    {url:API_BASE+'/manga/phenixscans/trending',type:'manga'},
  ];
}
```

### **Option 2: Unified French Search**

Create a French search using the aggregated endpoint:

```javascript
// Search all French providers at once
let searchUrl = API_BASE + '/manga/search?query=' + encodeURIComponent(query) 
  + '&providers=astralmanga,lelmanga,mangascantrad,mangasorigines,pantheonscan,phenixscans,sushiscan,sushiscans';
```

## Technical Details

### **Provider Architecture**

French providers are implemented as Paperback extensions, not standard Fastify routes. They use two template bases:

1. **Madara Template** (7 providers)
   - AstralManga, MangaScantrad, MangasOrigines, PantheonScan, PhenixScans, SushiScan, SushiScans
   - Location: `src/routes/french/templates/madara/`

2. **MangaReader Template** (1 provider)
   - LelManga
   - Location: `src/routes/french/templates/mangareader/`

### **File Structure**

```
src/routes/french/
├── index.ts                    # Metadata and routing
├── AstralManga/               # Provider implementation
│   ├── AstralManga.ts         # Provider class
│   └── includes/icon.png      # Provider icon
├── LelManga/
├── MangaScantrad/
├── ... (other providers)
└── templates/
    ├── madara/
    │   ├── base.ts            # Madara base class
    │   └── parser.ts          # Madara parser
    └── mangareader/
        ├── base.ts            # MangaReader base class
        └── parser.ts          # MangaReader parser
```

## Usage Examples

### **Search French Manga**

```bash
curl "http://localhost:3000/manga/search?query=naruto&providers=astralmanga"
```

### **Get Trending French Manga**

```bash
curl "http://localhost:3000/manga/astralmanga/trending"
```

### **Read a French Manga Chapter**

```bash
# 1. Search for manga
curl "http://localhost:3000/manga/astralmanga/naruto"

# 2. Get manga details with chapters
curl "http://localhost:3000/manga/astralmanga/info/{id}"

# 3. Read chapter pages
curl "http://localhost:3000/manga/astralmanga/read/{chapterId}"
```

## Recommendations

### **Best Practices:**

1. **Use Aggregated Search** - Search multiple French providers at once for better results
2. **Provider Fallback** - If one provider fails, try another
3. **Cache Results** - French providers may have slower responses, consider caching
4. **Rate Limiting** - Respect provider terms of service with request throttling

### **Performance Tips:**

- 🚀 Combine French with international providers for better coverage
- 🔍 Use specific provider searches for known content
- ⚡ Cache trending/popular lists
- 🛡️ Implement provider health checks

### **Future Enhancements:**

- [ ] Add French anime providers when available
- [ ] Create French-specific trending algorithm
- [ ] Add language preference setting to website
- [ ] Implement provider status monitoring
- [ ] Add French metadata (ratings, reviews in French)

## Notes

- These are **community fan-translation sites** (scanlations)
- Content is in **French language** with French titles/descriptions
- Availability depends on provider uptime
- Always respect provider terms of service
- Some providers may require Cloudflare bypass

## Support

For issues with specific French providers, check:
1. Provider website status
2. Provider-specific parser in `src/routes/french/{Provider}/`
3. Template base class in `src/routes/french/templates/`
