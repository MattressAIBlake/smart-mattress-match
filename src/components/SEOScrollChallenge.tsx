import { useState, useRef, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ReferralShareCard } from "./ReferralShareCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, Lock, Unlock } from "lucide-react";

export const SEOScrollChallenge = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const element = e.target as HTMLElement;
      if (!element) return;
      
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(Math.min(progress, 100));
      
      // Unlock at 85% scrolled
      if (progress >= 85 && !isUnlocked) {
        setIsUnlocked(true);
      }
    };

    // ScrollArea uses a viewport element, we need to find it
    const scrollAreaViewport = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollAreaViewport) {
      scrollAreaViewport.addEventListener('scroll', handleScroll);
      return () => scrollAreaViewport.removeEventListener('scroll', handleScroll);
    }
  }, [isUnlocked]);

  return (
    <div className="relative h-[85vh] flex flex-col">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-20 bg-background border-b pb-3 space-y-2">
        <Progress value={scrollProgress} className="h-2" />
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-medium flex items-center gap-2">
            {isUnlocked ? (
              <>
                <Unlock className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Unlocked! 🎉</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{Math.round(scrollProgress)}% - Keep scrolling...</span>
              </>
            )}
          </p>
          {!isUnlocked && (
            <ArrowDown className="h-4 w-4 text-muted-foreground animate-bounce" />
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div ref={contentRef} className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
          
          {/* Hero Title */}
          <div className="text-center space-y-3 pb-6 border-b">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Yes, This Page Is Shamelessly SEO'd<br />(Enjoy 10% Off for Helping)
            </h1>
            <p className="text-lg text-muted-foreground">
              Scroll to unlock your discount. We promise it's worth it (and mildly entertaining).
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-base leading-relaxed">
              Hi. Let's be honest with each other for a second.
            </p>
            <p className="text-base leading-relaxed">
              You're here for a 10% off deal.
            </p>
            <p className="text-base leading-relaxed">
              We're here because Google likes long, repetitive pages about things like the <span className="font-semibold text-primary">best queen mattress for side sleepers</span>.
            </p>
            <p className="text-base leading-relaxed">
              So we made this page. You scroll it. Google sees "Wow, people love this 'queen mattress for side sleepers' content." You get a discount. We get algorithm points. Everybody wins.
            </p>
            <p className="text-base leading-relaxed font-medium">
              So yes, this is both:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Mildly ridiculous, and</li>
              <li>Actually useful if you're a side sleeper shopping for a queen mattress.</li>
            </ol>
            <p className="text-base leading-relaxed font-semibold">
              Let's do this.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold">
              Why This Page Won't Shut Up About "Queen Mattress for Side Sleepers"
            </h2>
            <p className="text-base leading-relaxed font-semibold">
              Short answer: Google.
            </p>
            <p className="text-base leading-relaxed">
              Slightly longer answer: When people search things like:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
              <li>"best queen mattress for side sleepers"</li>
              <li>"queen mattress side sleeper hip pain"</li>
              <li>"soft queen mattress for side sleepers"</li>
              <li>"cooling queen mattress for side sleepers"</li>
            </ul>
            <p className="text-base leading-relaxed">
              We want our store—not 37 faceless mattress megasites—to show up.
            </p>
            <p className="text-base leading-relaxed">
              To do that, Google wants to see relevant content. Phrases. Context. Scroll time. So we're writing one very clear, very on-the-nose page about the <span className="font-semibold text-primary">queen mattress for side sleepers</span> problem.
            </p>
            <p className="text-base leading-relaxed">
              You scrolling this is literally helping signal to Google:
            </p>
            <p className="text-base leading-relaxed italic pl-4 border-l-4 border-primary">
              "Hey, this site cares about side sleepers and queen mattresses."
            </p>
            <p className="text-base leading-relaxed">
              And in return, we're giving you 10% off.
            </p>
            <p className="text-base leading-relaxed font-semibold">
              Deal?
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold">
              Real Talk: Why Side Sleepers Need the Right Queen Mattress
            </h2>
            <p className="text-base leading-relaxed">
              Now for the actual helpful part.
            </p>
            <p className="text-base leading-relaxed">
              If you're a side sleeper, the wrong mattress does this:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-destructive">
              <li>Crunches your shoulder</li>
              <li>Stabs your hip</li>
              <li>Bends your spine</li>
              <li>Makes you wake up like you fought a raccoon</li>
            </ul>
            <p className="text-base leading-relaxed font-semibold">
              A good queen mattress for side sleepers should:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-green-600 dark:text-green-400">
              <li>Be plush to medium so your shoulders and hips can sink a bit</li>
              <li>Have support so your spine stays aligned</li>
              <li>Offer pressure relief so you're not numb</li>
              <li>Be big enough (hello, queen size) for you, your partner, your kid, and that one pet who pays no rent</li>
            </ul>
            <p className="text-base leading-relaxed">
              So while this page is clearly doing SEO gymnastics, the advice is real:<br />
              You do actually need a good <span className="font-semibold text-primary">queen mattress for side sleepers</span>, not a random slab.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold">
              What to Look For in a Queen Mattress (Side Sleeper Edition)
            </h2>
            <p className="text-base leading-relaxed">
              Here's the quick checklist, both for you and the algorithm:
            </p>

            <div className="space-y-4 pl-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Comfort Level: Plush or Medium</h3>
                <p className="text-base leading-relaxed mb-2">
                  Most side sleepers do best with a medium or plush queen mattress:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  <li>Too firm → shoulder & hip pain</li>
                  <li>Too soft → saggy spine</li>
                  <li>Just right → <span className="font-semibold text-primary">queen mattress for side sleepers</span> with contour + support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">2. Pressure Relief</h3>
                <p className="text-base leading-relaxed mb-2">Look for:</p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  <li>Memory foam or foam layers that hug shoulders + hips</li>
                  <li>Support core (coils or high-density foam) so you don't sink like quicksand</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  That's why we keep saying <span className="font-semibold text-primary">pressure-relieving queen mattress for side sleepers</span>.<br />
                  Because you actually need it. And also because… Google.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">3. Support & Alignment</h3>
                <p className="text-base leading-relaxed mb-2">
                  You want a <span className="font-semibold text-primary">supportive queen mattress for side sleepers</span> that:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  <li>Keeps your spine neutral</li>
                  <li>Doesn't cave in the middle</li>
                  <li>Survives more than one Netflix binge era</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4. Cooling</h3>
                <p className="text-base leading-relaxed mb-2">
                  If you sleep hot, you'll want a <span className="font-semibold text-primary">cooling queen mattress for side sleepers</span>:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  <li>Breathable cover</li>
                  <li>Cooling gel / open-cell foams / coils</li>
                  <li>No 3am "lava bed" experience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold">
              Types of Queen Mattresses for Side Sleepers<br />
              <span className="text-lg text-muted-foreground">(Obvious Keyword Segment Incoming)</span>
            </h2>

            <div className="space-y-4 pl-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Queen Hybrid Mattress for Side Sleepers</h3>
                <p className="text-base leading-relaxed mb-2">
                  A <span className="font-semibold">queen hybrid mattress for side sleepers</span> = coils + foam.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  <li>Great support</li>
                  <li>Great airflow</li>
                  <li>Great pressure relief</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  If you like a balanced feel: this is often the <span className="font-semibold text-primary">best queen mattress for side sleepers</span> setup.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Queen Memory Foam Mattress for Side Sleepers</h3>
                <p className="text-base leading-relaxed mb-2">
                  A <span className="font-semibold">queen memory foam mattress for side sleepers</span>:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  <li>Hugs curves</li>
                  <li>Reduces motion transfer</li>
                  <li>Amazing for solo side sleepers or couples who toss/turn</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  If you like that "nestled in" feel, this is your lane.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Queen Pillow Top Mattress for Side Sleepers</h3>
                <p className="text-base leading-relaxed mb-2">
                  A <span className="font-semibold">queen pillow top mattress for side sleepers</span>:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  <li>Comfy, plush surface</li>
                  <li>Good for sore joints</li>
                  <li>Still supportive underneath</li>
                </ul>
                <p className="text-base leading-relaxed mt-2">
                  If "hotel bed vibes" is your aesthetic: yes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold">Why Queen Size, Specifically?</h2>
            <p className="text-base leading-relaxed">
              We could pretend this section isn't blatantly labeled for SEO. But here we are.
            </p>
            <p className="text-base leading-relaxed font-semibold">
              Reasons a queen mattress makes sense:
            </p>
            <p className="text-base leading-relaxed">
              60" x 80" = enough room for:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
              <li>One side sleeper who starfishes</li>
              <li>Two side sleepers with room to rotate</li>
              <li>Fits in most bedrooms</li>
              <li>More space = better alignment, less shoving your partner off the edge</li>
            </ul>
            <p className="text-base leading-relaxed mt-2">
              So if you're a side sleeper, a <span className="font-semibold text-primary">queen mattress</span> is the go-to sweet spot between space, comfort, and "my bed actually fits in my room."
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold">
              Side Sleeper Mistakes<br />
              <span className="text-lg text-muted-foreground">(That This Page Prevents While It Farms SEO)</span>
            </h2>
            <p className="text-base leading-relaxed font-semibold">Avoid these:</p>
            
            <div className="space-y-3 pl-4">
              <div>
                <p className="text-base font-semibold text-destructive">
                  Buying the cheapest queen mattress you can find.
                </p>
                <p className="text-sm text-muted-foreground">
                  You're on your side. You need support + pressure relief. Not a trampoline.
                </p>
              </div>

              <div>
                <p className="text-base font-semibold text-destructive">
                  Thinking "firm is always better."
                </p>
                <p className="text-sm text-muted-foreground">
                  Side sleepers usually need a bit of give. A firm queen mattress with no cushion? Shoulder and hip rage.
                </p>
              </div>

              <div>
                <p className="text-base font-semibold text-destructive">
                  Ignoring cooling.
                </p>
                <p className="text-sm text-muted-foreground">
                  Hot sleeper? Choose a <span className="font-semibold text-primary">cooling queen mattress for side sleepers</span>. Your future self thanks you.
                </p>
              </div>

              <div>
                <p className="text-base font-semibold text-destructive">
                  Not checking materials.
                </p>
                <p className="text-sm text-muted-foreground">
                  Go for durable foams and coils. A <span className="font-semibold text-primary">queen mattress for side sleepers</span> should last, not pancake.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4 pt-6 border-t bg-muted/30 -mx-6 px-6 py-6 rounded-lg">
            <h2 className="text-2xl font-bold">
              Transparency Break: You're Helping Our SEO Right Now
            </h2>
            <p className="text-base leading-relaxed">
              You've scrolled far enough that we can safely tell you this:
            </p>
            <p className="text-base leading-relaxed font-semibold">
              This page is absolutely:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Crafted to rank for terms like "<span className="font-semibold text-primary">best queen mattress for side sleepers</span>"</li>
              <li>Written so that when you search that, you (and Google) find our store, not another 38-list "maybe this one?" site</li>
              <li>Designed to reward humans who play along with 10% off</li>
            </ul>
            <p className="text-base leading-relaxed">
              We could've hidden this. But honestly? You're smart. You saw it.
            </p>
            <p className="text-base leading-relaxed">
              So here it is in plain English:
            </p>
            <div className="bg-background border-l-4 border-primary p-4 my-4">
              <p className="text-base leading-relaxed font-medium">
                You scrolling and reading this "<span className="font-semibold text-primary">queen mattress for side sleepers</span>" content helps our store show up in Google.<br />
                As a thank you, we give you a discount.
              </p>
            </div>
            <p className="text-base leading-relaxed">
              No dark patterns. Just cooperative algorithm gaming.
            </p>
          </section>

          {/* Final Section */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Your "Thanks for Helping the Algorithm" Reward 🎁
            </h2>
            <p className="text-base leading-relaxed font-semibold">
              Alright, you did it.
            </p>
            <p className="text-base leading-relaxed">
              You scrolled. You endured the repetition. You are now an accomplice in ethical SEO.
            </p>
            <p className="text-base leading-relaxed font-semibold text-lg">
              Your reward is unlocking below! ⬇️
            </p>
          </section>

          {/* TL;DR */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold">TL;DR (for Humans, Not Robots)</h2>
            <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
              <li>Yes, this page is intentionally optimized for "<span className="font-semibold text-primary">queen mattress for side sleepers</span>."</li>
              <li>Yes, we told you that out loud.</li>
              <li>Yes, the advice is real: if you're a side sleeper, get a mattress with pressure relief, support, and the right feel. A <span className="font-semibold text-primary">queen hybrid mattress</span> or <span className="font-semibold text-primary">queen memory foam mattress for side sleepers</span> is usually ideal.</li>
              <li>Yes, you get 10% off for making it this far and helping us impress Google.</li>
            </ul>
            <p className="text-base leading-relaxed font-semibold text-center py-4">
              Now go grab the mattress your side-sleeping self deserves.<br />
              You've already done the hard part: scrolling. 🛏️😄
            </p>
          </section>

          {/* Unlocked Referral Card */}
          {isUnlocked && (
            <div className="animate-in slide-in-from-top duration-500 pt-8 border-t-4 border-primary">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-primary mb-2">🎉 Congratulations! 🎉</h2>
                <p className="text-lg text-muted-foreground">
                  You've unlocked your referral code. Generate it below and share with friends!
                </p>
              </div>
              <ReferralShareCard />
            </div>
          )}

          {!isUnlocked && (
            <div className="text-center py-12 space-y-4 border-t-4 border-muted">
              <Lock className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold text-muted-foreground">
                Keep scrolling to unlock your referral code...
              </p>
              <p className="text-sm text-muted-foreground">
                You're at {Math.round(scrollProgress)}% - Almost there!
              </p>
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );
};
