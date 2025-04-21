using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace project_alpha_0._1.osztalyok
{
    internal class Reservations
    {
        public int id { get; set; }
        public bool active { get; set; }
        public bool inactive { get; set; }
        public int reservation_time { get; set; }
        public int sum { get; set; }
        public int reservation_owner_id { get; set; }
        public int park_slot { get; set; }
        public int parkhouse_id { get; set; }
    }
}
