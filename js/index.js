var showcase = new Vue ({
	el: '#app',
	data: {
        loading: true,
        courses: [],
        filtered: [],
        currency: 'рубли'
	},
	mounted() {
        this.getAllCases();
    },
	methods: {
		getAllCases () {
            $.ajax({
                url: 'http://krapipl.imumk.ru:8082/api/mobilev1/update',
                type: 'POST',
                data: {'data':''},
                dataType: 'json',
                success: res => {
                    this.courses = res.items;
                    this.filtered = res.items;
                },
                error: err => {
                    console.error('error - ', err);
                },
                complete: () => {
                    this.loading = false;
                }
            });
        },
        getGrades (grades) {
            let g = grades.split(';');
            return g.length > 1 ? ( g[0] + '-' + g[g.length-1] + ' классы' ) : grades + ' класс';
        },
        initFilter () {
            this.setFilter().then( () => this.findCourses());
        },
        setFilter () {
            return new Promise ((resolve, reject) => {
            this.filtered = this.courses;
            let selectors = $('#filterform select');

            Array.from(selectors).forEach( sel => {
                this.filtered = this.filtered.filter( item => {
                    if(sel.value == '') return true;
                    if (sel.id == 'grade') {
                        return item[sel.getAttribute('id')].split(';').includes(sel.value);
                    }
                    return item[sel.getAttribute('id')].toLowerCase() == sel.value.toLowerCase();
                });
            });
            resolve();
        });
        },
        findCourses () {
            if ($("#search").val() != '') {
                this.filtered = this.filtered.filter( item => {
                    return JSON.stringify(item).toLowerCase().includes($("#search").val().toLowerCase());
                })
            }
        }
    }
});