using project_alpha_0._1.osztalyok;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class parkinGarageEditAdd : Form
    {
        public parkinGarageEditAdd()
        {
            InitializeComponent();
            Start();

            button1.Click += backBtn;
            button2.Click += addBtn;
        }

        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);
            label2.BackColor = Color.FromArgb(93, 135, 54);
            label3.BackColor = Color.FromArgb(93, 135, 54);
            label4.BackColor = Color.FromArgb(93, 135, 54);
            label5.BackColor = Color.FromArgb(93, 135, 54);
            label6.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Parkolóház hozzáadása";
            label2.Text = "Név:";
            label3.Text = "Kapacitás:";
            label4.Text = "Cím:";
            label5.Text = "Nyitás:";
            label6.Text = "Zárás:";
            label7.Text = "Max. autó magasság:";
            label8.Text = "Max. foglalási idő:";
            button1.Text = "Vissza";
            button2.Text = "Hozzáadás";

            int label1Mid = label1.Width / 2;
            int button1Mid = button1.Width / 2;

            label1.Left = this.Width / 2 - label1Mid;
            button1.Left = this.Width / 2 - button1.Width - 40;
            button2.Left = this.Width / 2 + 40;

            textBox1.Left = button1.Left + button1Mid + 10;
            textBox2.Left = button1.Left + button1Mid + 10;
            textBox3.Left = button1.Left + button1Mid + 10;
            textBox4.Left = button1.Left + button1Mid + 10;
            textBox5.Left = button1.Left + button1Mid + 10;
            textBox6.Left = button1.Left + button1Mid + 10;
            textBox7.Left = button1.Left + button1Mid + 10;

            label2.Left = (button1.Left + button1Mid) - label2.Width;
            label3.Left = (button1.Left + button1Mid) - label3.Width;
            label4.Left = (button1.Left + button1Mid) - label4.Width;
            label5.Left = (button1.Left + button1Mid) - label5.Width;
            label6.Left = (button1.Left + button1Mid) - label6.Width;
            label7.Left = (button1.Left + button1Mid) - label7.Width;
            label8.Left = (button1.Left + button1Mid) - label8.Width;

            label2.Top = textBox1.Top + ((textBox1.Height / 2) - (label2.Height / 2));
            label3.Top = textBox2.Top + ((textBox2.Height / 2) - (label3.Height / 2));
            label4.Top = textBox3.Top + ((textBox3.Height / 2) - (label4.Height / 2));
            label5.Top = textBox4.Top + ((textBox4.Height / 2) - (label5.Height / 2));
            label6.Top = textBox5.Top + ((textBox5.Height / 2) - (label6.Height / 2));
            label7.Top = textBox6.Top + ((textBox6.Height / 2) - (label7.Height / 2));
            label8.Top = textBox7.Top + ((textBox7.Height / 2) - (label8.Height / 2));
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption, MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Close();
                parkinGarageEdit parkingEdit = new parkinGarageEdit();
                parkingEdit.Show();
            }
        }

        public async void addBtn(object s, EventArgs e)
        {
            HttpRequestek request = new HttpRequestek();

            if (string.IsNullOrEmpty(textBox1.Text) || string.IsNullOrEmpty(textBox2.Text) || string.IsNullOrEmpty(textBox3.Text) || string.IsNullOrEmpty(textBox4.Text) || string.IsNullOrEmpty(textBox5.Text) || string.IsNullOrEmpty(textBox6.Text) || string.IsNullOrEmpty(textBox7.Text))
            {
                

                const string message1 = "Kérlek töltsd ki az összes mezőt!";
                const string caption1 = "Hiba";
                MessageBox.Show(message1, caption1, MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            string name = textBox1.Text;
            int capacity = int.Parse(textBox2.Text);
            string address = textBox3.Text;
            DateTime opening_time = DateTime.Parse(textBox4.Text).AddHours(2);
            DateTime closing_time = DateTime.Parse(textBox5.Text).AddHours(2);
            int max_height = int.Parse(textBox6.Text);
            int max_reservation_time = int.Parse(textBox7.Text);

            if (capacity > 26)
            {
                const string message11 = "A parkolóház maximális kapacitása 26 hely!";
                const string caption11 = "Hiba";
                MessageBox.Show(message11, caption11, MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            const string message = "Biztosan hozzáadod ezt a Parkolóházat?";
            const string caption = "Hozzáadás";
            var result = MessageBox.Show(message, caption, MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                bool reqResult = await request.postParkhouses(name, capacity, address, opening_time, closing_time, max_height, max_reservation_time);
                if (reqResult == true)
                {
                    MessageBox.Show("Parkolóház hozzáadva!", "Sikeres hozzáadás", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                    parkinGarageEdit parkingEdit = new parkinGarageEdit();
                    parkingEdit.Show();
                }
            }
        }
    }
}
