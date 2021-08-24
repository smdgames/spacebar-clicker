class Game {
    constructor() {
        
    }

    init() {
        // Counter
        this.cc = gId("counter");
        this.cs = gId("per_second");
        this.counter = new Counter();

        // Key button
        this.sb = gId("sb");
        this.sb.addEventListener("click", this.click.bind(this));
        document.addEventListener("keydown", this.keydown.bind(this));
        document.setValue = this.setValue.bind(this);

        // Particles
        this.click_particle = new ParticleSystem(1.0, (p) => { 
            p.y = lerp(p.y, p.iy - 120, 0.05); 
            p.x = p.ix + Math.sin(p.normalized_time * 10) * 10;
            p.alpha = p.normalized_time;
        });
        
        // Items
        this.items = [];
        this.item_container = gId("items");
        let item_template = gId("it");
        for (let i in ITEMS) {
            let it = ITEMS[i];
            let html = item_template.innerHTML
            .replace("%1", it.name)
            .replace("%2", it.description)
            .replace("%3", it.cost)
            .replace("%4", it.lvl);

            let e = document.createElement("li");
            e.classList.add("item");
            e.innerHTML = html;
            this.item_container.appendChild(e);
            it.dyn_element = e;
            e.addEventListener("click", this.buy.bind(this, it));
        }
        this.item_container.removeChild(item_template);
        
        this.update();

        setInterval(this.update.bind(this), 100);
    }

    update() {
        this.updateCounter();
        this.updateItems();
    }
    
    updateItems() {
        for (let i in ITEMS) {
            let it = ITEMS[i];

            it.dyn_element.classList.remove("item_buyable");
            it.dyn_element.getElementsByClassName("icost")[0].innerHTML = nfmt(it.cost);
            it.dyn_element.getElementsByClassName("ilvl")[0].innerHTML = it.lvl;

            if (it.cost <= this.counter.v) {
                it.dyn_element.classList.add("item_buyable");
            }
        }
    }
    
    updateCounter() {
        this.cc.innerHTML = nfmt(this.counter.v);
        this.cs.innerHTML = "per second: " + nfmt1(this.counter.va);
    }

    buy(it) {
        if (this.counter.v < it.cost) return;

        this.counter.spend(Math.floor(it.cost));
        it.lvl++;
        it.cost = it.cost_func(it.cost);
        
        if (it.initial_value != undefined)
            it.value = it.value == undefined ? it.value_func(it.initial_value) : it.value_func(it.value);

        this.counter.evaluateItems();

        this.update();
    }
    
    setValue(v) {
        this.counter.setValue(v);
        this.update();
    }

    click(e) {
        let val = this.counter.addOne();
        this.updateCounter();

        this.addPointParticle(e.clientX, e.clientY, val);
    }
    
    keydown(e) {
        if (e.code == "Space") this.click();
    }
    
    // Particles
    addPointParticle(x, y, val) {
        let element = document.createElement('div');
        element.textContent = "+" + val;
        element.classList.add("particle");
        element.classList.add("score");
        let xr = (Math.random() * 30) - 30;
        let yr = (Math.random() * 30) - 50;
        this.click_particle.pushParticle(element, { x: x + xr, y: y + yr });
        document.body.insertBefore(element, document.body.firstChild);
    }
}