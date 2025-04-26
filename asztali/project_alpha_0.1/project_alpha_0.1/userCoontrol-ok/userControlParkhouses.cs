using project_alpha_0._1.osztalyok;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1.userCoontrol_ok
{
    internal class userControlParkhouses : UserControl
    {
        public int phID { get; set; }

        private Panel panel1;
        private Button button3;
        private Button button2;
        private Button button1;
        public TextBox textBox5;
        private Label label5;
        public TextBox textBox4;
        private Label label4;
        public TextBox textBox3;
        private Label label3;
        public TextBox textBox2;
        private Label label2;
        public TextBox textBox1;
        private Label label1;

        HttpRequestek request = new HttpRequestek();

        public userControlParkhouses()
        {
            InitializeComponent();
            Start();
            button1.Click += GetReady;
            button2.Click += editData;
            button3.Click += deleteParkhouse;
        }

        public async void Start()
        {
            label1.Text = "Név:";
            label1.BackColor = Color.FromArgb(169, 196, 108);
            label2.Text = "Kapacitás: ";
            label2.BackColor = Color.FromArgb(169, 196, 108);
            label3.Text = "Cím:";
            label3.BackColor = Color.FromArgb(169, 196, 108);
            label4.Text = "Nyitás:";
            label4.BackColor = Color.FromArgb(169, 196, 108);
            label5.Text = "Zárás:";
            label5.BackColor = Color.FromArgb(169, 196, 108);

            textBox1.Enabled = false;
            textBox2.Enabled = false;
            textBox3.Enabled = false;
            textBox4.Enabled = false;
            textBox5.Enabled = false;

            button1.Text = "Módosítás";
            button2.Text = "Mentés";
            button2.Enabled = false;
            button3.Text = "Törlés";

            this.BackColor = Color.FromArgb(244, 255, 195);
            panel1.BackColor = Color.FromArgb(128, 157, 60);

            button1.Left = button2.Left - button1.Width - 10;
            button2.Left = panel1.Width / 2 - button2.Width / 2;
            button3.Left = button2.Left + button2.Width + 10;


        }

        public void GetReady(object s, EventArgs e)
        {
            textBox1.Enabled = true;
            textBox2.Enabled = true;
            textBox3.Enabled = true;
            textBox4.Enabled = true;
            textBox5.Enabled = true;

            button1.Enabled = false;
            button2.Enabled = true;
        }

        public async void editData(object s, EventArgs e)
        {
            if (phID <= 0)
            {
                MessageBox.Show("Hibás parkolóház azonosító!");
                return;
            }

            bool result = await request.putUpdateParkhouses(phID, textBox1.Text, int.Parse(textBox2.Text), textBox3.Text, DateTime.Parse(textBox4.Text), DateTime.Parse(textBox5.Text));
            MessageBox.Show(result.ToString());
            if (result == true)
            {
                textBox1.Enabled = false;
                textBox2.Enabled = false;
                textBox3.Enabled = false;
                textBox4.Enabled = false;
                textBox5.Enabled = false;

                button1.Enabled = true;
                button2.Enabled = false;
            }

        }

        public async void deleteParkhouse(object s, EventArgs e)
        {
            if (phID <= 0)
            {
                MessageBox.Show("Hibás parkolóház azonosító!");
                return;
            }
            bool result = await request.deleteParkhouses(phID);
            if (result)
            {
                MessageBox.Show("Parkolóház törölve!");
                this.Dispose();
            }
            else
            {
                MessageBox.Show("Hiba történt a parkolóház törlésekor!");
            }
        }


        private void InitializeComponent()
        {
            this.panel1 = new System.Windows.Forms.Panel();
            this.button3 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            this.textBox5 = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.textBox4 = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.textBox3 = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.SystemColors.ControlDark;
            this.panel1.Controls.Add(this.button3);
            this.panel1.Controls.Add(this.button2);
            this.panel1.Controls.Add(this.button1);
            this.panel1.Controls.Add(this.textBox5);
            this.panel1.Controls.Add(this.label5);
            this.panel1.Controls.Add(this.textBox4);
            this.panel1.Controls.Add(this.label4);
            this.panel1.Controls.Add(this.textBox3);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Controls.Add(this.textBox2);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Controls.Add(this.textBox1);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Location = new System.Drawing.Point(3, 3);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(301, 167);
            this.panel1.TabIndex = 0;
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(218, 140);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(75, 23);
            this.button3.TabIndex = 12;
            this.button3.Text = "button3";
            this.button3.UseVisualStyleBackColor = true;
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(121, 140);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 11;
            this.button2.Text = "button2";
            this.button2.UseVisualStyleBackColor = true;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(26, 140);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 10;
            this.button1.Text = "button1";
            this.button1.UseVisualStyleBackColor = true;
            // 
            // textBox5
            // 
            this.textBox5.Location = new System.Drawing.Point(121, 112);
            this.textBox5.Name = "textBox5";
            this.textBox5.Size = new System.Drawing.Size(158, 20);
            this.textBox5.TabIndex = 9;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(11, 115);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(35, 13);
            this.label5.TabIndex = 8;
            this.label5.Text = "label5";
            // 
            // textBox4
            // 
            this.textBox4.Location = new System.Drawing.Point(121, 86);
            this.textBox4.Name = "textBox4";
            this.textBox4.Size = new System.Drawing.Size(158, 20);
            this.textBox4.TabIndex = 7;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(11, 89);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(35, 13);
            this.label4.TabIndex = 6;
            this.label4.Text = "label4";
            // 
            // textBox3
            // 
            this.textBox3.Location = new System.Drawing.Point(121, 60);
            this.textBox3.Name = "textBox3";
            this.textBox3.Size = new System.Drawing.Size(158, 20);
            this.textBox3.TabIndex = 5;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(11, 63);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(35, 13);
            this.label3.TabIndex = 4;
            this.label3.Text = "label3";
            // 
            // textBox2
            // 
            this.textBox2.Location = new System.Drawing.Point(121, 34);
            this.textBox2.Name = "textBox2";
            this.textBox2.Size = new System.Drawing.Size(158, 20);
            this.textBox2.TabIndex = 3;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(11, 37);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(35, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "label2";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(121, 8);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(158, 20);
            this.textBox1.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(11, 11);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(35, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "label1";
            // 
            // userControlParkhouses
            // 
            this.Controls.Add(this.panel1);
            this.Name = "userControlParkhouses";
            this.Size = new System.Drawing.Size(307, 173);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);

        }
    }
}
