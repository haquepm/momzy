"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ExternalLink,Search,SlidersHorizontal} from "lucide-react";
import {supabase} from "@/lib/supabase";

type DiaperVariant={id:string;brand:string;variant_name:string;diaper_size:string|null;pack_count:number;image_url:string;amazon_url:string|null;flipkart_url:string|null;amazon_price:number|null;flipkart_price:number|null;is_active:boolean;updated_at:string};
type Offer={marketplace:"Amazon"|"Flipkart";price:number;perDiaper:number;url:string|null};
const rupees=(v:number)=>"₹"+v.toLocaleString("en-IN",{maximumFractionDigits:2});
export default function DiapersPage(){
 const[items,setItems]=useState<DiaperVariant[]>([]);
 const[loading,setLoading]=useState(true);
 const[error,setError]=useState("");
 const[search,setSearch]=useState("");
 const[rate,setRate]=useState<number|null>(null);
 useEffect(()=>{
  const params=new URLSearchParams(window.location.search);
  const requested=Number(params.get("rate"));
  if(params.has("rate")&&Number.isFinite(requested))setRate(requested);
  if(!supabase){setError("The catalogue is temporarily unavailable.");setLoading(false);return;}
  let live=true;
  (async()=>{
   const{data,error:loadError}=await supabase.from("diaper_variants").select("id,brand,variant_name,diaper_size,pack_count,image_url,amazon_url,flipkart_url,amazon_price,flipkart_price,is_active,updated_at").eq("is_active",true).order("brand").order("variant_name");
   if(!live)return;
   if(loadError)setError(loadError.message);
   else setItems((data||[]) as DiaperVariant[]);
   setLoading(false);
  })();
  return()=>{live=false};
 },[]);
 const cards=useMemo(()=>items.map(item=>{
  const offers:Offer[]=[
   ...(item.amazon_price&&Number(item.amazon_price)>0?[{marketplace:"Amazon" as const,price:Number(item.amazon_price),perDiaper:Number(item.amazon_price)/item.pack_count,url:item.amazon_url}]:[]),
   ...(item.flipkart_price&&Number(item.flipkart_price)>0?[{marketplace:"Flipkart" as const,price:Number(item.flipkart_price),perDiaper:Number(item.flipkart_price)/item.pack_count,url:item.flipkart_url}]:[])
  ];
  return {item,offers,best:offers.length?Math.min(...offers.map(x=>x.perDiaper)):null};
 }).filter(x=>x.offers.length>0)
 .filter(x=>!rate||x.best!==null&&Math.round(x.best)===rate)
 .filter(x=>(x.item.brand+" "+x.item.variant_name+" "+(x.item.diaper_size||"")).toLowerCase().includes(search.toLowerCase()))
 .sort((a,b)=>(a.best??Infinity)-(b.best??Infinity)),[items,rate,search]);
 const bands=useMemo(()=>[...new Set(items.flatMap(x=>[x.amazon_price,x.flipkart_price].filter((v):v is number=>v!==null&&Number(v)>0).map(v=>Math.round(Number(v)/x.pack_count))))].sort((a,b)=>a-b),[items]);
 return <main className="lb-diapers-page">
  <header className="lb-diapers-header"><Link href="/" className="lb-diapers-brand">🧺 Little <em>Basket</em></Link><Link href="/" className="lb-diapers-back"><ArrowLeft size={16}/> Back to store</Link></header>
  <section className="lb-diapers-hero"><div><small>DIAPER PRICE COMPARISON</small><h1>Find the lowest price <em>per diaper</em></h1><p>Compare pack prices from Amazon and Flipkart, normalized by the number of diapers in each pack.</p></div><strong>Pay less<br/>per diaper.</strong></section>
  <section className="lb-diapers-content">
   <div className="lb-diapers-toolbar"><div><h2>Diapers by brand & variant</h2><p>Showing current prices entered by Little Basket</p></div><label><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search brand or size"/></label></div>
   <div className="lb-diapers-rate-filters"><button className={rate===null?"active":""} onClick={()=>{setRate(null);history.replaceState(null,"","/diapers")}}>All price bands</button>{bands.map(b=><button key={b} className={rate===b?"active":""} onClick={()=>{setRate(b);history.replaceState(null,"","/diapers?rate="+b)}}>₹{b} / diaper</button>)}</div>
   {loading&&<p className="lb-diapers-status">Loading diaper prices…</p>}
   {error&&<p className="lb-diapers-status">{error}</p>}
   {!loading&&!error&&cards.length===0&&<div className="lb-diapers-empty"><h3>No diaper prices found</h3><p>{rate!==null?"No variants currently fall in this per-diaper price band.":"Add diaper variants and enter today's Amazon or Flipkart price in the admin dashboard."}</p><button onClick={()=>{setRate(null);setSearch("");history.replaceState(null,"","/diapers")}}>Show all priced variants</button></div>}
   <div className="lb-diapers-grid">{cards.map(({item,offers,best})=><article className="lb-diaper-card" key={item.id}>
    <div className="lb-diaper-photo"><img src={item.image_url} alt={item.brand+" "+item.variant_name}/><span>{item.pack_count} pcs / pack</span></div>
    <div className="lb-diaper-info"><small>{item.brand}</small><h3>{item.variant_name}</h3><p>{item.diaper_size?item.diaper_size+" size · ":""}{item.pack_count} diapers in this pack</p>
     {best!==null&&<div className="lb-diaper-unit"><small>LOWEST PRICE PER DIAPER</small><strong>{rupees(best)}</strong></div>}
     <div className="lb-diaper-offers">{(["Amazon","Flipkart"] as const).map(market=>{const o=offers.find(x=>x.marketplace===market);if(!o)return <div className="lb-diaper-offer unavailable" key={market}><span>{market}</span><b>Price not updated</b></div>;const isBest=o.perDiaper===best;return <div className={"lb-diaper-offer"+(isBest?" best":"")} key={market}><span>{market}{isBest&&<i>LOWEST</i>}</span><b>{rupees(o.price)}</b><small>{rupees(o.perDiaper)} / diaper</small>{o.url?<a href={o.url} target="_blank" rel="nofollow sponsored noopener noreferrer">View on {market} <ExternalLink size={13}/></a>:<span className="link-missing">Product link not added</span>}</div>})}</div>
     <small className="lb-diaper-updated">Price updated: {new Date(item.updated_at).toLocaleDateString("en-IN")}</small>
    </div>
   </article>)}</div>
  </section>
  <footer className="lb-diapers-footer"><Link href="/">← Little Basket home</Link><small>Prices are manually updated by Little Basket. Please confirm the final price on the retailer's website before purchase.</small></footer>
 </main>;
}
