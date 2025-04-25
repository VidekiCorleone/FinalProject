using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace project_alpha_0._1.osztalyok
{
    internal class Parkhouses
    {
        public int id { get; set; }
        public string name { get; set; }
        public int capacity { get; set; }
        public string address { get; set; }
        public int rating { get; set; }
        public DateTime opening { get; set; }
        public DateTime closing { get; set; }
        public int car_height { get; set; }
        public int max_stay_time { get; set; }
        //public int parkslot_id { get; set; } //felt cute, might delete later
    }
}
