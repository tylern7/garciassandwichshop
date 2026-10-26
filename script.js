(function(){
  var burger=document.querySelector('.burger'),menu=document.getElementById('menu');
  function close(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');}
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  document.getElementById('yr').textContent=new Date().getFullYear();

  // Contact form keeps the original Divi field names and endpoint (/garcias-contact-page).
  // On garciassandwichshop.ca it fetches a fresh security nonce from that WordPress page and posts to it.
  // Anywhere else (e.g. the preview link) it opens a pre-filled email instead, so nothing is lost.
  var LIVE=/(^|\.)garciassandwichshop\.ca$/i.test(location.hostname);
  var TO='garciassandwichshop@hotmail.com',EP='/garcias-contact-page';
  var form=document.getElementById('contact-form');if(!form)return;
  var msg=form.querySelector('.form-msg');
  function mailto(f){
    var body='Name: '+f.et_pb_contact_name_0.value+'\nPhone: '+f.et_pb_contact_phone_0.value+'\nEmail: '+f.et_pb_contact_email_0.value+'\n\n'+f.et_pb_contact_requirements_0.value;
    location.href='mailto:'+TO+'?subject='+encodeURIComponent('Website inquiry from '+f.et_pb_contact_name_0.value)+'&body='+encodeURIComponent(body);
    msg.textContent='Opening your email app…';
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();var f=form.elements;
    if(!f.et_pb_contact_name_0.value.trim()||!f.et_pb_contact_phone_0.value.trim()||!f.et_pb_contact_requirements_0.value.trim()){msg.textContent='Please fill in all fields.';return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.et_pb_contact_email_0.value.trim())){msg.textContent='Please enter a valid email address.';return;}
    if(!LIVE){mailto(f);return;}
    msg.textContent='Sending…';
    fetch(EP,{credentials:'same-origin'}).then(function(r){return r.text();}).then(function(h){
      var d=new DOMParser().parseFromString(h,'text/html');
      var n=d.querySelector('input[name="_wpnonce-et-pb-contact-form-submitted-0"]');
      if(!n)throw new Error('no nonce');
      var p=new URLSearchParams();
      ['et_pb_contact_name_0','et_pb_contact_phone_0','et_pb_contact_email_0','et_pb_contact_requirements_0'].forEach(function(k){p.append(k,f[k].value);});
      p.append('et_pb_contactform_submit_0','et_contact_proccess');
      p.append('_wpnonce-et-pb-contact-form-submitted-0',n.value);
      p.append('_wp_http_referer',EP);
      p.append('et_pb_contact_email_fields_0',JSON.stringify([
        {field_id:'et_pb_contact_name_0',original_id:'name',required_mark:'required',field_type:'input',field_label:'Name'},
        {field_id:'et_pb_contact_phone_0',original_id:'phone',required_mark:'required',field_type:'input',field_label:'Phone'},
        {field_id:'et_pb_contact_email_0',original_id:'email',required_mark:'required',field_type:'email',field_label:'Email Address'},
        {field_id:'et_pb_contact_requirements_0',original_id:'requirements',required_mark:'required',field_type:'text',field_label:'Requirement Details'}]));
      p.append('et_pb_contact_email_hidden_fields_0','[]');
      return fetch(EP,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:p.toString()});
    }).then(function(r){return r.text();}).then(function(t){
      if(/et-pb-contact-message[^>]*>\s*<p>[^<]*(thank|success)/i.test(t)){msg.textContent='Thanks for contacting us! We’ll get back to you soon.';form.reset();}
      else{mailto(f);}
    }).catch(function(){mailto(f);});
  });
})();
