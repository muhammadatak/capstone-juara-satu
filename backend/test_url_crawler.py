"""
Test script untuk URL Crawler - Screenshot functionality
"""
import asyncio
from pathlib import Path
from services.url_crawler import crawler


async def test_crawler():
    """Test URL crawler dengan beberapa URL"""
    
    test_urls = [
        "https://www.google.com",
        "https://www.github.com",
        "https://www.cimbniaga.co.id",
    ]
    
    print("=" * 70)
    print("TEST URL CRAWLER - SCREENSHOT FUNCTIONALITY")
    print("=" * 70)
    
    for url in test_urls:
        print(f"\n📍 Testing: {url}")
        print("-" * 70)
        
        try:
            result = await crawler.crawl(url)
            
            print(f"✅ Success!")
            print(f"   Original URL:    {url}")
            print(f"   Final URL:       {result['final_url']}")
            print(f"   Screenshot UUID: {result['screenshot_uuid']}")
            
            # Check if screenshot exists
            screenshot_path = crawler.screenshot_dir / f"{result['screenshot_uuid']}.png"
            if screenshot_path.exists():
                file_size = screenshot_path.stat().st_size
                print(f"   Screenshot Path: {screenshot_path}")
                print(f"   File Size:       {file_size:,} bytes")
            else:
                print(f"   ⚠️  Screenshot file not found!")
                
        except Exception as e:
            print(f"❌ Failed: {type(e).__name__}")
            print(f"   Error: {str(e)}")
    
    print("\n" + "=" * 70)
    print("TEST COMPLETED")
    print("=" * 70)
    
    # Show screenshot directory
    if crawler.screenshot_dir.exists():
        screenshots = list(crawler.screenshot_dir.glob("*.png"))
        print(f"\n📁 Screenshots saved in: {crawler.screenshot_dir}")
        print(f"   Total screenshots: {len(screenshots)}")
        for ss in screenshots:
            print(f"   - {ss.name} ({ss.stat().st_size:,} bytes)")
    
    # Close browser
    await crawler.close()
    print("\n✅ Browser closed. Test complete!")


if __name__ == "__main__":
    asyncio.run(test_crawler())
